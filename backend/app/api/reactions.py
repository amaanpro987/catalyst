"""API Routes - Reactions endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import ReactionCreate, ReactionResponse
from app.core.logging import logger

router = APIRouter(prefix="/api/reactions", tags=["reactions"])


@router.post("/", response_model=ReactionResponse)
def create_reaction(reaction: ReactionCreate, db: Session = Depends(get_db)):
    """
    Create a new target reaction query.
    
    Example request:
    ```json
    {
      "name": "CO2 + H2 to Methanol",
      "reactants": ["CO2", "H2"],
      "products": ["CH3OH"],
      "temperature": 250.0,
      "pressure": 50.0,
      "solvent": "water"
    }
    ```
    
    This triggers the full discovery pipeline:
    1. Knowledge Retrieval - fetch known catalysts
    2. Generative Design - create novel variants
    3. Prediction - rank all candidates
    4. Visualization - prepare interactive displays
    """
    logger.info(f"Creating new reaction: {reaction.name}")
    
    try:
        # In production, save to database
        # db_reaction = Reaction(**reaction.dict())
        # db.add(db_reaction)
        # db.commit()
        # db.refresh(db_reaction)
        
        # For MVP, return mock response
        return {
            "id": f"reaction_{reaction.name.replace(' ', '_').lower()}",
            "name": reaction.name,
            "reactants": reaction.reactants,
            "products": reaction.products,
            "temperature": reaction.temperature,
            "pressure": reaction.pressure,
            "solvent": reaction.solvent,
            "description": reaction.description,
            "created_at": "2026-05-05T00:00:00",
        }
    except Exception as e:
        logger.error(f"Error creating reaction: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{reaction_id}", response_model=ReactionResponse)
def get_reaction(reaction_id: str, db: Session = Depends(get_db)):
    """Retrieve details of a specific reaction"""
    logger.info(f"Retrieving reaction: {reaction_id}")
    # Mock implementation
    return {
        "id": reaction_id,
        "name": "Sample Reaction",
        "reactants": ["A", "B"],
        "products": ["C"],
        "temperature": 298.15,
        "pressure": 1.0,
        "solvent": "water",
        "description": None,
        "created_at": "2026-05-05T00:00:00",
    }


@router.get("/")
def list_reactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """List all reactions"""
    logger.info(f"Listing reactions (skip={skip}, limit={limit})")
    return {"reactions": [], "total": 0}
