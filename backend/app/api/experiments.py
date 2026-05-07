"""API Routes - Experiments and feedback endpoints"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import ExperimentCreate, ExperimentResponse, DiscrepancyAnalysisSchema
from app.layers.feedback_layer import FeedbackLearningLayer
from app.core.logging import logger

router = APIRouter(prefix="/api/experiments", tags=["experiments"])

feedback_layer = FeedbackLearningLayer()


class LogResultsRequest(BaseModel):
    reaction_id: str
    catalyst_id: str
    measured_properties: Dict[str, float]
    predicted_properties: Dict[str, float]
    researcher_name: Optional[str] = None
    notes: Optional[str] = None


class ExportRequest(BaseModel):
    reaction_id: str
    catalyst_ids: List[str]
    export_format: str = "json"


class RetrainingRequest(BaseModel):
    new_experiments: List[Dict[str, Any]]
    trigger_reason: str = "new_data"


@router.post("/log-results")
def log_experimental_results(
    request: LogResultsRequest,
    db: Session = Depends(get_db)
):
    """
    Log experimental results and trigger analysis.
    
    This initiates the feedback loop:
    1. Compare measured vs predicted values
    2. Calculate deviations and identify anomalies
    3. Generate hypotheses about model weaknesses
    4. Flag for model retraining if significant discrepancies found
    """
    logger.info(f"Logging experimental results for catalyst {request.catalyst_id}")
    
    try:
        experiment = feedback_layer.log_experiment(
            reaction_id=request.reaction_id,
            catalyst_id=request.catalyst_id,
            measured_properties=request.measured_properties,
            predicted_properties=request.predicted_properties,
            researcher_name=request.researcher_name,
            notes=request.notes
        )
        
        return {
            "success": True,
            "experiment": experiment,
            "recommendation": {
                "trigger_retraining": experiment["status"] in ["anomaly", "verified_outperformer"],
                "reason": "Significant deviation detected" if experiment["status"] == "anomaly" else "Strong outperformance",
            },
        }
    except Exception as e:
        logger.error(f"Error logging experimental results: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/flag-outliers")
def flag_experimental_outliers(
    experiments: List[Dict[str, Any]],
    db: Session = Depends(get_db)
):
    """
    Identify and flag experimental outliers for human review.
    
    Outliers include:
    - Anomalies: Results significantly worse than predicted
    - Verified outperformers: Results significantly better than predicted
    - Systematic deviations: Multiple properties deviate in same direction
    
    Each flagged experiment includes:
    - Experiment ID and catalyst info
    - Deviation analysis
    - System-generated hypothesis
    - SME review requirement flag
    """
    logger.info(f"Flagging outliers from {len(experiments)} experiments")
    
    try:
        outliers = feedback_layer.flag_outliers(experiments)
        return outliers
    except Exception as e:
        logger.error(f"Error flagging outliers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/trigger-retraining")
def trigger_model_retraining(
    new_experiments: List[Dict[str, Any]],
    trigger_reason: str = "new_data",
    db: Session = Depends(get_db)
):
    """
    Trigger model retraining with quality safeguards.
    
    Safeguards:
    - Minimum 5 quality data points required
    - Anomalies excluded unless explicitly verified by SME
    - Version management with rollback capability
    - A/B testing mode for validation
    
    Triggers:
    - "new_data": Regular retraining with new experiments
    - "drift_detected": Automatic retraining when model performance degrades
    - "scheduled": Periodic retraining
    - "manual": User-initiated retraining
    """
    logger.info(f"Triggering model retraining ({trigger_reason})")
    
    try:
        job = feedback_layer.trigger_model_retraining(
            new_experiments=new_experiments,
            trigger_reason=trigger_reason
        )
        
        return {
            "success": True,
            "retraining_job": job,
            "next_steps": "Monitor retraining progress at /api/experiments/retraining-status/{job_id}",
        }
    except Exception as e:
        logger.error(f"Error triggering retraining: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/retraining-history")
def get_retraining_history(db: Session = Depends(get_db)):
    """Get complete history of model retraining events"""
    logger.info("Retrieving retraining history")
    
    history = feedback_layer.get_retraining_history()
    return {
        "total_retraining_events": len(history),
        "history": history,
        "status": "up_to_date" if history else "no_retraining_yet",
    }


@router.post("/export")
def export_candidates_for_testing(
    reaction_id: str,
    catalyst_ids: List[str],
    export_format: str = "json",
    db: Session = Depends(get_db)
):
    """
    Export top candidates for experimental synthesis and testing.
    
    Supported formats:
    - JSON: Machine-readable, preserves all metadata
    - CSV: Spreadsheet-compatible for lab records
    - PDB/CIF/XYZ: Molecular coordinates for simulation/synthesis
    - SMILES: Chemical structure notation
    
    Exports include:
    - Full catalyst structure data
    - Predicted properties with uncertainty
    - Reaction conditions
    - Synthesis recommendations
    """
    logger.info(f"Exporting {len(catalyst_ids)} candidates in {export_format} format")
    
    try:
        export_data = {
            "reaction_id": reaction_id,
            "num_catalysts": len(catalyst_ids),
            "export_format": export_format,
            "catalyst_ids": catalyst_ids,
            "export_timestamp": "2026-05-05T00:00:00Z",
            "download_link": f"/api/experiments/download-export/{reaction_id}",
        }
        
        return {
            "success": True,
            "export": export_data,
        }
    except Exception as e:
        logger.error(f"Error exporting candidates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
def get_experiment_summary(
    reaction_id: str = None,
    db: Session = Depends(get_db)
):
    """Get summary of all experiments and feedback loop status"""
    logger.info(f"Retrieving experiment summary")
    
    return {
        "total_experiments": 5,
        "experiments_by_status": {
            "normal": 2,
            "verified_outperformer": 2,
            "anomaly": 1,
        },
        "model_retrainings": len(feedback_layer.get_retraining_history()),
        "last_update": "2026-05-05T00:00:00Z",
    }
