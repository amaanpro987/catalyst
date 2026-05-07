"""API Routes - Catalysts endpoints"""

from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import CatalystResponse, CatalystListResponse, GenerativeRequestSchema, GeneratedCatalystSchema
from app.layers.knowledge_layer import KnowledgeLayer
from app.layers.generative_layer import GenerativeLayer
from app.core.logging import logger

router = APIRouter(prefix="/api/catalysts", tags=["catalysts"])

knowledge_layer = KnowledgeLayer()
generative_layer = GenerativeLayer()


@router.post("/retrieve")
def retrieve_known_catalysts(
    reaction_id: str,
    reactants: List[str],
    products: List[str],
    limit: int = 23,
    db: Session = Depends(get_db)
):
    """
    Retrieve known catalysts from scientific databases for a target reaction.
    
    Databases queried:
    - Materials Project (MPID structures and properties)
    - Open Catalyst Project (OC20/OC22 dataset)
    - BRENDA (enzyme catalysts)
    - Internal experiment database
    
    Returns up to 23 known catalysts ranked by relevance.
    """
    logger.info(f"Retrieving known catalysts for {reactants} → {products}")
    
    try:
        retrieved = knowledge_layer.retrieve_catalysts_for_reaction(
            reactants=reactants,
            products=products,
            limit=limit
        )
        
        return {
            "reaction_id": reaction_id,
            "count": len(retrieved),
            "catalysts": [
                {
                    "id": cat["id"],
                    "name": cat["name"],
                    "composition": cat["composition"],
                    "source": cat["source"],
                    "activity": cat.get("activity"),
                    "selectivity": cat.get("selectivity"),
                    "stability": cat.get("stability"),
                    "description": cat.get("description"),
                }
                for cat in retrieved
            ],
        }
    except Exception as e:
        logger.error(f"Error retrieving catalysts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate", response_model=dict)
def generate_catalyst_variants(request: GenerativeRequestSchema, db: Session = Depends(get_db)):
    """
    Generate novel catalyst variants using AI generative models.
    
    Uses:
    - Graph Neural Networks (GNNs) with graph diffusion
    - Trained on OC20/OC22 benchmarks
    - Generates 8 novel candidates per request
    
    Each variant includes:
    - Composition (elements and ratios)
    - Modification type (doping, substitution, etc.)
    - Predicted property improvements
    - Confidence score
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
        
        # Validate structures
        validated = []
        for var in variants:
            validation = generative_layer.validate_structure(var["composition"])
            validated.append({
                **var,
                "is_valid": validation["is_valid"],
                "validation_confidence": validation["confidence"],
                "requires_human_review": validation["requires_human_review"],
            })
        
        return {
            "base_catalyst": request.base_catalyst,
            "optimization_target": request.optimization_target,
            "num_variants": len(variants),
            "variants": validated,
            "model_version": generative_layer.generative_model_version,
        }
    except Exception as e:
        logger.error(f"Error generating variants: {str(e)}")
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
