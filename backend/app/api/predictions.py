"""API Routes - Predictions endpoints"""

import uuid
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.schemas.schemas import PredictionRankingResponse
from app.models.models import Prediction
from app.layers.prediction_layer import PredictionLayer
from app.core.logging import logger

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

prediction_layer = PredictionLayer()


class RankRequest(BaseModel):
    catalysts: List[Dict[str, Any]]
    reaction_conditions: Dict[str, Any]
    reaction_id: str
    weights: Optional[Dict[str, float]] = None


class PredictSingleRequest(BaseModel):
    catalyst: Dict[str, Any]
    reaction_conditions: Dict[str, Any]
    reaction_id: str


@router.post("/rank")
def rank_catalysts(
    request: RankRequest,
    db: Session = Depends(get_db)
):
    """
    Predict properties for multiple catalysts and rank them, then persist results.
    """
    logger.info(f"Ranking {len(request.catalysts)} catalysts for reaction {request.reaction_id}")
    
    try:
        if not request.reaction_conditions:
            reaction_conditions = {
                "temperature": 298.15,
                "pressure": 1.0,
                "solvent": "water"
            }
        else:
            reaction_conditions = request.reaction_conditions
        
        # Predict properties for all catalysts
        predictions = prediction_layer.batch_predict(request.catalysts, reaction_conditions)
        
        # Rank catalysts
        ranked = prediction_layer.rank_catalysts(predictions, request.weights)
        
        saved_predictions = []
        for r in ranked:
            db_prediction = Prediction(
                id=str(uuid.uuid4()),
                reaction_id=request.reaction_id,
                catalyst_id=r["catalyst_id"],
                activity=r["activity"],
                selectivity=r["selectivity"],
                stability=r["stability"],
                combined_score=r["combined_score"],
                rank=r["rank"],
                uncertainty=r["uncertainty"],
                model_version=prediction_layer.model_version,
                reaction_conditions=reaction_conditions
            )
            db.add(db_prediction)
            saved_predictions.append(db_prediction)
            
        db.commit()
        
        return {
            "reaction_conditions": reaction_conditions,
            "total_catalysts": len(ranked),
            "predictions": ranked,
            "model_info": {
                "version": prediction_layer.model_version,
                "confidence": prediction_layer.model_confidence,
                "avg_uncertainty": sum(p["uncertainty"] for p in ranked) / len(ranked) if ranked else 0,
            },
        }
    except Exception as e:
        logger.error(f"Error ranking catalysts: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict-single")
def predict_single_catalyst(
    request: PredictSingleRequest,
    db: Session = Depends(get_db)
):
    """Predict properties for a single catalyst and persist"""
    logger.info(f"Predicting properties for {request.catalyst.get('name', 'unknown')}")
    
    try:
        prediction = prediction_layer.predict_properties(request.catalyst, request.reaction_conditions)
        
        db_prediction = Prediction(
            id=str(uuid.uuid4()),
            reaction_id=request.reaction_id,
            catalyst_id=request.catalyst["id"],
            activity=prediction["activity"],
            selectivity=prediction["selectivity"],
            stability=prediction["stability"],
            uncertainty=prediction.get("uncertainty", 0.1),
            model_version=prediction_layer.model_version,
            reaction_conditions=request.reaction_conditions
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        return {
            "catalyst_id": request.catalyst["id"],
            "catalyst_name": request.catalyst["name"],
            "prediction": prediction,
            "model_version": prediction_layer.model_version,
        }
    except Exception as e:
        logger.error(f"Error predicting properties: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/model-info")
def get_prediction_model_info(db: Session = Depends(get_db)):
    """Get detailed information about the prediction model"""
    logger.info("Retrieving prediction model information")
    
    return {
        **prediction_layer.get_model_details(),
        "available_since": "2026-01-15",
        "last_updated": "2026-05-01",
        "status": "production",
    }

