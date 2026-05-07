"""Repository/Service layer — CRUD operations for all models."""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.utils import generate_id
from app.models.models import Catalyst, Experiment, ModelVersion, Prediction, Reaction


# ──────────────────────────────────────────────────────────────────────────────
# Reactions
# ──────────────────────────────────────────────────────────────────────────────

class ReactionRepository:

    @staticmethod
    def create(db: Session, data: Dict[str, Any]) -> Reaction:
        reaction = Reaction(
            id=generate_id(),
            name=data["name"],
            reactants=data["reactants"],
            products=data["products"],
            temperature=data.get("temperature", 298.15),
            pressure=data.get("pressure", 1.0),
            solvent=data.get("solvent", "water"),
            description=data.get("description"),
        )
        db.add(reaction)
        db.commit()
        db.refresh(reaction)
        return reaction

    @staticmethod
    def get(db: Session, reaction_id: str) -> Optional[Reaction]:
        return db.query(Reaction).filter(Reaction.id == reaction_id).first()

    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 50) -> List[Reaction]:
        return db.query(Reaction).order_by(Reaction.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def count(db: Session) -> int:
        return db.query(Reaction).count()


# ──────────────────────────────────────────────────────────────────────────────
# Catalysts
# ──────────────────────────────────────────────────────────────────────────────

class CatalystRepository:

    @staticmethod
    def create(db: Session, data: Dict[str, Any]) -> Catalyst:
        catalyst = Catalyst(
            id=data.get("id", generate_id()),
            reaction_id=data.get("reaction_id"),
            name=data["name"],
            composition=data["composition"],
            source=data.get("source", "known"),
            confidence=data.get("confidence", 0.9),
            activity=data.get("activity"),
            selectivity=data.get("selectivity"),
            stability=data.get("stability"),
            description=data.get("description"),
            structure_data=data.get("structure_data") or data.get("structure"),
            modification_type=data.get("modification_type"),
            modification_description=data.get("modification_description"),
            is_valid=data.get("is_valid", True),
            requires_human_review=data.get("requires_human_review", False),
        )
        db.add(catalyst)
        db.commit()
        db.refresh(catalyst)
        return catalyst

    @staticmethod
    def get(db: Session, catalyst_id: str) -> Optional[Catalyst]:
        return db.query(Catalyst).filter(Catalyst.id == catalyst_id).first()

    @staticmethod
    def list_for_reaction(db: Session, reaction_id: str) -> List[Catalyst]:
        return db.query(Catalyst).filter(Catalyst.reaction_id == reaction_id).all()

    @staticmethod
    def list_known(db: Session, limit: int = 23) -> List[Catalyst]:
        return (
            db.query(Catalyst)
            .filter(Catalyst.source == "known")
            .order_by((Catalyst.activity + Catalyst.selectivity).desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def count_by_source(db: Session) -> Dict[str, int]:
        from sqlalchemy import func
        rows = db.query(Catalyst.source, func.count(Catalyst.id)).group_by(Catalyst.source).all()
        return {src: cnt for src, cnt in rows}

    @staticmethod
    def bulk_create_if_not_exists(db: Session, catalysts: List[Dict[str, Any]]) -> List[Catalyst]:
        """Insert known catalysts from the seed data if they don't exist yet."""
        created: List[Catalyst] = []
        for data in catalysts:
            existing = db.query(Catalyst).filter(Catalyst.id == data["id"]).first()
            if not existing:
                obj = CatalystRepository.create(db, data)
                created.append(obj)
        return created


# ──────────────────────────────────────────────────────────────────────────────
# Predictions
# ──────────────────────────────────────────────────────────────────────────────

class PredictionRepository:

    @staticmethod
    def create(db: Session, data: Dict[str, Any]) -> Prediction:
        prediction = Prediction(
            id=generate_id(),
            reaction_id=data["reaction_id"],
            catalyst_id=data["catalyst_id"],
            activity=data["activity"],
            selectivity=data["selectivity"],
            stability=data["stability"],
            turnover_frequency=data.get("turnover_frequency"),
            combined_score=data.get("combined_score"),
            rank=data.get("rank"),
            uncertainty=data.get("uncertainty", 0.1),
            model_version=data.get("model_version", "v1.0-gnn"),
            reaction_conditions=data.get("reaction_conditions"),
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        return prediction

    @staticmethod
    def bulk_create(db: Session, predictions: List[Dict[str, Any]]) -> List[Prediction]:
        objs = []
        for data in predictions:
            obj = Prediction(
                id=generate_id(),
                reaction_id=data["reaction_id"],
                catalyst_id=data["catalyst_id"],
                activity=data["activity"],
                selectivity=data["selectivity"],
                stability=data["stability"],
                turnover_frequency=data.get("turnover_frequency"),
                combined_score=data.get("combined_score"),
                rank=data.get("rank"),
                uncertainty=data.get("uncertainty", 0.1),
                model_version=data.get("model_version", "v1.0-gnn"),
                reaction_conditions=data.get("reaction_conditions"),
            )
            objs.append(obj)
        db.add_all(objs)
        db.commit()
        return objs

    @staticmethod
    def list_for_reaction(db: Session, reaction_id: str) -> List[Prediction]:
        return (
            db.query(Prediction)
            .filter(Prediction.reaction_id == reaction_id)
            .order_by(Prediction.rank)
            .all()
        )

    @staticmethod
    def count(db: Session) -> int:
        return db.query(Prediction).count()


# ──────────────────────────────────────────────────────────────────────────────
# Experiments
# ──────────────────────────────────────────────────────────────────────────────

class ExperimentRepository:

    @staticmethod
    def create(db: Session, data: Dict[str, Any]) -> Experiment:
        experiment = Experiment(
            id=data.get("experiment_id", generate_id()),
            reaction_id=data["reaction_id"],
            catalyst_id=data["catalyst_id"],
            measured_activity=data.get("measured_properties", {}).get("activity"),
            measured_selectivity=data.get("measured_properties", {}).get("selectivity"),
            measured_stability=data.get("measured_properties", {}).get("stability"),
            yield_percentage=data.get("measured_properties", {}).get("yield"),
            predicted_activity=data.get("predicted_properties", {}).get("activity"),
            predicted_selectivity=data.get("predicted_properties", {}).get("selectivity"),
            predicted_stability=data.get("predicted_properties", {}).get("stability"),
            activity_deviation=_safe_deviation(
                data.get("measured_properties", {}).get("activity"),
                data.get("predicted_properties", {}).get("activity"),
            ),
            selectivity_deviation=_safe_deviation(
                data.get("measured_properties", {}).get("selectivity"),
                data.get("predicted_properties", {}).get("selectivity"),
            ),
            stability_deviation=_safe_deviation(
                data.get("measured_properties", {}).get("stability"),
                data.get("predicted_properties", {}).get("stability"),
            ),
            status=data.get("status", "normal"),
            hypothesis=data.get("hypothesis"),
            notes=data.get("notes"),
            researcher_name=data.get("researcher_name"),
        )
        db.add(experiment)
        db.commit()
        db.refresh(experiment)
        return experiment

    @staticmethod
    def list_all(db: Session, skip: int = 0, limit: int = 50) -> List[Experiment]:
        return (
            db.query(Experiment)
            .order_by(Experiment.logged_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def list_for_reaction(db: Session, reaction_id: str) -> List[Experiment]:
        return db.query(Experiment).filter(Experiment.reaction_id == reaction_id).all()

    @staticmethod
    def count(db: Session) -> int:
        return db.query(Experiment).count()

    @staticmethod
    def count_by_status(db: Session) -> Dict[str, int]:
        from sqlalchemy import func
        rows = db.query(Experiment.status, func.count(Experiment.id)).group_by(Experiment.status).all()
        return {status: cnt for status, cnt in rows}


# ──────────────────────────────────────────────────────────────────────────────
# Model Versions
# ──────────────────────────────────────────────────────────────────────────────

class ModelVersionRepository:

    @staticmethod
    def create(db: Session, data: Dict[str, Any]) -> ModelVersion:
        mv = ModelVersion(
            id=generate_id(),
            version=data["version"],
            model_type=data.get("model_type", "GNN"),
            status=data.get("status", "active"),
            trigger_reason=data.get("trigger_reason"),
            training_samples=data.get("training_samples"),
            accuracy_score=data.get("accuracy_score"),
            accuracy_improvement=data.get("accuracy_improvement"),
            training_started_at=data.get("training_started_at"),
            training_completed_at=data.get("training_completed_at"),
        )
        db.add(mv)
        db.commit()
        db.refresh(mv)
        return mv

    @staticmethod
    def list_all(db: Session) -> List[ModelVersion]:
        return db.query(ModelVersion).order_by(ModelVersion.created_at.desc()).all()

    @staticmethod
    def get_active(db: Session) -> Optional[ModelVersion]:
        return db.query(ModelVersion).filter(ModelVersion.status == "active").first()


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _safe_deviation(measured: Optional[float], predicted: Optional[float]) -> Optional[float]:
    if measured is None or predicted is None or predicted == 0:
        return None
    return round((measured - predicted) / predicted * 100, 2)
