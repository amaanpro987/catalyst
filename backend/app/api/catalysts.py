"""API Routes - Catalysts endpoints"""

import uuid
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import CatalystResponse, CatalystListResponse, GenerativeRequestSchema, GeneratedCatalystSchema
from app.models.models import Catalyst
from app.layers.knowledge_layer import KnowledgeLayer
from app.layers.generative_layer import GenerativeLayer
from app.core.logging import logger

router = APIRouter(prefix="/api/catalysts", tags=["catalysts"])

knowledge_layer = KnowledgeLayer()
generative_layer = GenerativeLayer()


class RetrieveRequest(BaseModel):
    reaction_id: str
    reactants: List[str]
    products: List[str]
    limit: int = Field(default=23)


@router.post("/retrieve")
def retrieve_known_catalysts(
    request: RetrieveRequest,
    db: Session = Depends(get_db)
):
    """
    Retrieve known catalysts from scientific databases for a target reaction and persist them.
    """
    logger.info(f"Retrieving known catalysts for {request.reactants} → {request.products}")
    
    try:
        retrieved = knowledge_layer.retrieve_catalysts_for_reaction(
            reactants=request.reactants,
            products=request.products,
            limit=request.limit
        )
        
        saved_catalysts = []
        for cat in retrieved:
            # Check if already exists for this reaction to avoid duplicates if necessary
            # For now, we'll create new entries or update
            db_catalyst = Catalyst(
                id=str(uuid.uuid4()),
                reaction_id=request.reaction_id,
                name=cat["name"],
                composition=cat["composition"],
                source=cat["source"],
                activity=cat.get("activity"),
                selectivity=cat.get("selectivity"),
                stability=cat.get("stability"),
                description=cat.get("description")
            )
            db.add(db_catalyst)
            saved_catalysts.append(db_catalyst)
            
        db.commit()
        for cat in saved_catalysts:
            db.refresh(cat)
        
        return {
            "reaction_id": request.reaction_id,
            "count": len(saved_catalysts),
            "catalysts": [CatalystResponse.model_validate(c) for c in saved_catalysts],
        }
    except Exception as e:
        logger.error(f"Error retrieving catalysts: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=dict)
def generate_catalyst_variants(request: GenerativeRequestSchema, db: Session = Depends(get_db)):
    """
    Generate novel catalyst variants using AI generative models and persist them.
    """
    logger.info(f"Generating {request.num_variants} variants of {request.base_catalyst}")
    
    try:
        # Mock base catalyst for demonstration
        base_catalyst = {
            "id": "cat_001",
            "name": request.base_catalyst,
            "composition": "Cu0.6Zn0.2Al0.2",
            "activity": 72.5,
            "selectivity": 88.0,
            "stability": 85.0,
        }
        
        variants = generative_layer.generate_variants(
            base_catalyst=base_catalyst,
            num_variants=request.num_variants,
            optimization_target=request.optimization_target
        )
        
        saved_variants = []
        for var in variants:
            validation = generative_layer.validate_structure(var["composition"])
            
            db_catalyst = Catalyst(
                id=str(uuid.uuid4()),
                reaction_id=request.reaction_id,
                name=var["name"],
                composition=var["composition"],
                source="generated",
                activity=var.get("activity"),
                selectivity=var.get("selectivity"),
                stability=var.get("stability"),
                description=f"Generated variant of {request.base_catalyst}",
                modification_type=request.optimization_target,
                is_valid=validation["is_valid"],
                requires_human_review=validation["requires_human_review"]
            )
            db.add(db_catalyst)
            saved_variants.append(db_catalyst)
            
        db.commit()
        for var in saved_variants:
            db.refresh(var)
        
        return {
            "base_catalyst": request.base_catalyst,
            "optimization_target": request.optimization_target,
            "num_variants": len(saved_variants),
            "variants": [CatalystResponse.model_validate(v) for v in saved_variants],
            "model_version": generative_layer.generative_model_version,
        }
    except Exception as e:
        logger.error(f"Error generating variants: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
def get_knowledge_base_statistics(db: Session = Depends(get_db)):
    """Get statistics about the knowledge base"""
    logger.info("Retrieving knowledge base statistics")
    
    stats = knowledge_layer.get_statistics()
    return {
        **stats,
        "last_updated": "2026-05-05T00:00:00Z",
        "sources_description": {
            "Materials Project": "10 catalysts from computational database",
            "Open Catalyst Project": "8 catalysts from OC20/OC22",
            "BRENDA": "3 enzyme catalysts",
            "experimental": "2 from internal experiments",
        },
    }
