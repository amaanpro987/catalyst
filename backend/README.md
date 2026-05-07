# Backend - Catalyst Discovery Platform

Python FastAPI backend for the Catalyst & Enzyme Discovery Platform.

## Project Structure

```
app/
├── core/
│   ├── config.py           # Configuration settings
│   ├── logging.py          # Logging setup
│   └── utils.py            # Utility functions
├── layers/                 # Core ML/AI layers
│   ├── knowledge_layer.py  # Scientific database retrieval (23 known catalysts)
│   ├── generative_layer.py # Novel design generation (8 variants)
│   ├── prediction_layer.py # Property prediction & ranking
│   ├── visualization_layer.py # Data formatting for UI
│   └── feedback_layer.py   # Experiment logging & model retraining
├── api/                    # REST API endpoints
│   ├── reactions.py        # Reaction management
│   ├── catalysts.py        # Catalyst retrieval & generation
│   ├── predictions.py      # Prediction ranking
│   ├── visualization.py    # Visualization data
│   └── experiments.py      # Feedback loop & retraining
├── db/
│   ├── database.py         # Database connection
│   └── models.py           # SQLAlchemy ORM models
├── models/
│   └── models.py           # Database models
├── schemas/
│   └── schemas.py          # Pydantic request/response schemas
└── main.py                 # FastAPI application entry point
```

## Core Workflow

```
1. Reaction Input (POST /api/reactions)
   ↓
2. Knowledge Retrieval (POST /api/catalysts/retrieve)
   - Retrieves 23 known catalysts from scientific databases
   ↓
3. Generative Design (POST /api/catalysts/generate)
   - Generates 8 novel catalyst variants
   ↓
4. Prediction & Ranking (POST /api/predictions/rank)
   - Predicts activity, selectivity, stability
   - Ranks all 31 candidates (23 known + 8 generated)
   ↓
5. Visualization (POST /api/visualization/performance-plot)
   - Formats data for interactive UI
   ↓
6. Export (POST /api/experiments/export)
   - Export top candidates for synthesis
   ↓
7. Feedback Loop (POST /api/experiments/log-results)
   - Log experimental outcomes
   - Analyze predicted vs actual deviations
   ↓
8. Model Retraining (POST /api/experiments/trigger-retraining)
   - Retrain with quality safeguards
   - Version management and rollback
```

## API Documentation

Once running, view full API docs at:
- Interactive UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI Schema: `http://localhost:8000/openapi.json`

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn app.main:app --reload
```

API will be available at `http://localhost:8000`

## Five Core Layers

### 1. Knowledge Layer (`knowledge_layer.py`)
- Retrieves known catalysts from scientific databases
- Sources: Materials Project, Open Catalyst Project, BRENDA, UniProt, internal experiments
- Mock implementation: 23 curated catalysts
- Production: Real API integration with semantic matching

### 2. Generative Layer (`generative_layer.py`)
- Generates 8 novel catalyst variants per reaction
- Modifications: doping, substitution, composition shift, support change
- Validation: Valency rules, steric constraints, SME review
- Models: GNNs + Diffusion (trained on OC20/OC22)

### 3. Prediction Layer (`prediction_layer.py`)
- Predicts catalytic properties (activity, selectivity, stability)
- Uncertainty estimation
- Models: SchNet/DimeNet-style GNNs
- Ranks all candidates with customizable weights

### 4. Visualization Layer (`visualization_layer.py`)
- Formats catalyst data for 3D/2D viewers
- Creates Plotly-compatible visualizations
- Performance plots (Activity vs Selectivity colored by Stability)
- Ranking tables with interactive features

### 5. Feedback & Learning Layer (`feedback_layer.py`)
- Logs experimental results (measured vs predicted)
- Deviation analysis and hypothesis generation
- Triggers model retraining with safeguards
- Quality gates: minimum 5 samples, exclude anomalies
- Version management with A/B testing

## Data Models

```python
Reaction:
  - id, name, reactants, products
  - conditions: temperature, pressure, solvent
  - relationships: catalysts, predictions, experiments

Catalyst:
  - id, reaction_id, name, composition
  - source: "known" or "generated"
  - confidence: float (0-1)
  - structure_data: JSON

Prediction:
  - id, reaction_id, catalyst_id
  - properties: activity, selectivity, stability, TOF
  - uncertainty: float (0-1)
  - model_version, created_at

Experiment:
  - id, reaction_id, catalyst_id
  - measured_properties: activity, selectivity, stability
  - deviations: absolute & percent
  - hypothesis, status, researcher_name

ModelVersion:
  - version, model_type, accuracy_score
  - training_samples, training_completed_at
  - status: active/archived/testing
```

## Case Study: Ethanol-to-Jet Conversion

```
Input: "ethanol + H2 → jet fuel" at 250K, 50 atm

Output:
- 23 known catalysts retrieved
- 8 novel variants generated (Cu-based modifications)
- 31 total candidates ranked

Experiment Results (3 weeks later):
- 2 candidates exceeded predictions (verified outperformers)
- 1 matched predictions (normal)
- 2 underperformed (flagged as anomalies)

Analysis:
- System identifies steric hindrance as likely cause of underperformance
- Proposes retraining with new data
- Version v1.1 deployed with improved predictions

Follow-up:
- Junior researcher validates hypothesis
- Proposes experiment to test structural feature
- Full attribution tracked in platform
```

## Configuration

Set environment variables in `.env`:

```
DATABASE_URL=sqlite:///./catalyst.db
SECRET_KEY=your-secret-key
DEBUG=True
API_TITLE=Catalyst Discovery Platform
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

## Testing

```bash
pytest tests/
```

## Production Notes

For production deployment:
1. Replace SQLite with PostgreSQL
2. Configure MLflow for experiment tracking
3. Use production secret key
4. Set up MinIO for molecular file storage
5. Implement real database API integrations
6. Add authentication and authorization
7. Configure logging and monitoring
8. Set up CI/CD pipeline

## Technology Stack

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **ORM**: SQLAlchemy 2.0.23
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ML/AI**: PyTorch, scikit-learn, RDKit
- **Chemistry**: ASE (Atomic Simulation Environment)
- **Visualization**: Plotly
- **Data**: NumPy, Pandas, SciPy
- **Graph**: NetworkX
