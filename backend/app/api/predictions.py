"""API Routes - Predictions endpoints"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import PredictionRankingResponse
from app.layers.prediction_layer import PredictionLayer
from app.core.logging import logger

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

prediction_layer = PredictionLayer()


@router.post("/rank")
def rank_catalysts(
    catalysts: List[Dict[str, Any]],
    reaction_conditions: Dict[str, float],
    weights: Dict[str, float] = None,
    db: Session = Depends(get_db)
):
    """
    Predict properties for multiple catalysts and rank them.
    
    Input:
    - catalysts: List of catalyst objects (known or generated)
    - reaction_conditions: Temperature (K), pressure (atm), solvent
    - weights: Optional custom weights for activity, selectivity, stability
    
    Output:
    - Ranked list with predicted properties
    - Combined scores and rankings
    - Uncertainty estimates
    
    Default weights: equal (0.33 each)
    """
    logger.info(f"Ranking {len(catalysts)} catalysts")
    
    try:
        if not reaction_conditions:
            reaction_conditions = {
                "temperature": 298.15,
                "pressure": 1.0,
                "solvent": "water"
            }
        
        # Predict properties for all catalysts
        predictions = prediction_layer.batch_predict(catalysts, reaction_conditions)
        
        # Rank catalysts
        ranked = prediction_layer.rank_catalysts(predictions, weights)
        
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
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict-single")
def predict_single_catalyst(
    catalyst: Dict[str, Any],
    reaction_conditions: Dict[str, float],
    db: Session = Depends(get_db)
):
    """Predict properties for a single catalyst"""
    logger.info(f"Predicting properties for {catalyst.get('name', 'unknown')}")
    
    try:
        prediction = prediction_layer.predict_properties(catalyst, reaction_conditions)
        
        return {
            "catalyst_id": catalyst["id"],
            "catalyst_name": catalyst["name"],
            "prediction": prediction,
            "model_version": prediction_layer.model_version,
        }
    except Exception as e:
        logger.error(f"Error predicting properties: {str(e)}")
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
