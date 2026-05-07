"""API Routes - Visualization endpoints"""

from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import VisualizationDataSchema, DashboardStatsSchema
from app.layers.visualization_layer import VisualizationLayer
from app.core.logging import logger

router = APIRouter(prefix="/api/visualization", tags=["visualization"])

visualization_layer = VisualizationLayer()


@router.post("/catalyst-structure")
def format_catalyst_for_viewer(
    catalyst: Dict[str, Any],
    prediction: Dict[str, Any] = None,
    db: Session = Depends(get_db)
):
    """
    Format catalyst data for interactive 3D/2D molecular viewer.
    
    Returns:
    - 3D atomic coordinates (for 3Dmol.js or Plotly)
    - 2D SMILES representation
    - Active site identification
    - Interactive visualization hints
    """
    logger.info(f"Formatting catalyst {catalyst.get('name')} for visualization")
    
    try:
        formatted = visualization_layer.format_catalyst_for_viewer(catalyst, prediction)
        return formatted
    except Exception as e:
        logger.error(f"Error formatting catalyst: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/performance-plot")
def create_performance_plot(
    predictions: List[Dict[str, Any]],
    db: Session = Depends(get_db)
):
    """
    Create Plotly-compatible data for performance comparison plot.
    
    Visualization: Scatter plot with:
    - X-axis: Activity
    - Y-axis: Selectivity
    - Color: Stability
    - Size: Uncertainty (larger = higher uncertainty)
    """
    logger.info(f"Creating performance plot for {len(predictions)} catalysts")
    
    try:
        plot_data = visualization_layer.create_performance_plot_data(predictions)
        return {
            "type": "plotly",
            "plot": plot_data,
        }
    except Exception as e:
        logger.error(f"Error creating plot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ranking-table")
def create_ranking_table(
    predictions: List[Dict[str, Any]],
    db: Session = Depends(get_db)
):
    """
    Create tabular data for ranking display.
    
    Returns structured table data with:
    - Ranking position
    - Catalyst name and composition
    - Predicted metrics (activity, selectivity, stability)
    - Combined score
    - Uncertainty estimates
    """
    logger.info(f"Creating ranking table for {len(predictions)} catalysts")
    
    try:
        table_data = visualization_layer.create_ranking_table_data(predictions)
        return table_data
    except Exception as e:
        logger.error(f"Error creating table: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/energy-diagram")
def get_reaction_energy_diagram(
    catalyst_id: str,
    db: Session = Depends(get_db)
):
    """
    Get reaction energy profile diagram for a catalyst.
    
    Shows:
    - Reactant and product energies
    - Reaction intermediates
    - Activation barriers
    - Exothermic/endothermic nature
    """
    logger.info(f"Creating energy diagram for catalyst {catalyst_id}")
    
    try:
        diagram = visualization_layer.create_reaction_energy_diagram(catalyst_id)
        return diagram
    except Exception as e:
        logger.error(f"Error creating energy diagram: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/dashboard-summary")
def get_dashboard_summary(
    reaction_id: str,
    predictions: List[Dict[str, Any]],
    db: Session = Depends(get_db)
):
    """
    Get summary statistics for the main dashboard.
    
    Returns:
    - Total catalysts and split by type
    - Average metrics
    - Top 5 recommendations
    - Key statistics
    """
    logger.info(f"Creating dashboard summary for reaction {reaction_id}")
    
    try:
        summary = visualization_layer.get_dashboard_summary(reaction_id, predictions)
        return summary
    except Exception as e:
        logger.error(f"Error creating dashboard summary: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/export-formats")
def get_supported_export_formats(db: Session = Depends(get_db)):
    """Get list of supported export formats for catalysts"""
    return {
        "molecular_formats": [
            {"format": "PDB", "description": "Protein Data Bank format", "extension": ".pdb"},
            {"format": "CIF", "description": "Crystallographic Information File", "extension": ".cif"},
            {"format": "XYZ", "description": "XYZ coordinate format", "extension": ".xyz"},
            {"format": "POSCAR", "description": "VASP format", "extension": ".vasp"},
            {"format": "SMILES", "description": "Simplified Molecular Input Line Entry System", "extension": ".smi"},
        ],
        "data_formats": [
            {"format": "JSON", "description": "JavaScript Object Notation", "extension": ".json"},
            {"format": "CSV", "description": "Comma-Separated Values", "extension": ".csv"},
            {"format": "Excel", "description": "Microsoft Excel", "extension": ".xlsx"},
        ],
    }
