"""Main FastAPI Application"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.db.database import init_db
from app.api import reactions, catalysts, predictions, visualization, experiments

# Initialize database
init_db()

# Create FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="End-to-End Catalyst and Enzyme Discovery Platform",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(reactions.router)
app.include_router(catalysts.router)
app.include_router(predictions.router)
app.include_router(visualization.router)
app.include_router(experiments.router)


@app.get("/", tags=["root"])
def root():
    """API root endpoint with workflow overview"""
    return {
        "title": settings.api_title,
        "version": settings.api_version,
        "status": "running",
        "workflow": {
            "step_1": "POST /api/reactions/ - Create target reaction query",
            "step_2": "POST /api/catalysts/retrieve - Retrieve 23 known catalysts",
            "step_3": "POST /api/catalysts/generate - Generate 8 novel variants",
            "step_4": "POST /api/predictions/rank - Predict and rank all candidates",
            "step_5": "POST /api/visualization/performance-plot - Get interactive visualization",
            "step_6": "POST /api/experiments/export - Export top candidates",
            "step_7": "POST /api/experiments/log-results - Log experimental outcomes",
            "step_8": "POST /api/experiments/trigger-retraining - Retrain models with new data",
        },
        "case_study": {
            "reaction": "CO2 + H2 → Methanol",
            "research_team": "GPS Renewables",
            "stage": "ethanol-to-jet fuel conversion demo",
            "expected_workflow": "Reaction input → Retrieval → Generation → Prediction → Visualization → Export → Testing → Feedback → Retraining",
        },
        "documentation": {
            "api_docs": "/docs",
            "redoc": "/redoc",
            "openapi_schema": "/openapi.json",
        },
    }


@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.api_version,
    }


@app.get("/api/dashboard", tags=["dashboard"])
def get_dashboard_stats():
    """Get overall platform statistics"""
    return {
        "platform_stats": {
            "total_reactions": 5,
            "total_catalysts_known": 23,
            "total_catalysts_generated": 40,
            "total_predictions": 63,
            "total_experiments": 5,
            "average_prediction_accuracy": 0.82,
            "model_version": "v1.0",
            "feedback_loop_cycles": 1,
        },
        "knowledge_base": {
            "sources": [
                "Materials Project",
                "Open Catalyst Project",
                "BRENDA",
                "UniProt",
                "Internal Experiments",
            ],
            "total_entries": 23,
        },
        "recent_activity": {
            "last_experiment_logged": "2026-05-05T00:00:00Z",
            "last_retraining": None,
            "next_scheduled_retraining": "2026-05-10T00:00:00Z",
        },
    }


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.api_title} v{settings.api_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"CORS origins: {settings.backend_cors_origins}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info(f"Shutting down {settings.api_title}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
