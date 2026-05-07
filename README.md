# Catalyst & Enzyme Discovery Platform

An end-to-end AI-powered platform for discovering and optimizing catalysts and enzymes through knowledge retrieval, generative design, predictive modeling, and experimental feedback loops.

## Architecture Overview

```
Target Reaction Input 
    ↓
Knowledge Retrieval (Scientific Databases)
    ↓
Generative Design (AI-generated variants)
    ↓
Multi-Scale Prediction (Activity, Selectivity, Stability)
    ↓
Ranking & Visualization (Interactive 3D/2D viewers)
    ↓
Experimental Export & Testing
    ↓
Feedback Loop (Results logging & model retraining)
```

## Core Layers

### 1. **Knowledge Layer**
- Retrieves known catalysts from scientific databases
- Sources: Materials Project, Open Catalyst Project, BRENDA, UniProt, internal experiments
- Mock data includes 23 known catalysts for demonstration

### 2. **Generative Layer**
- Graph Neural Networks + Diffusion models for novel catalyst structures
- Protein language models for enzyme variants
- Generates 8 novel candidate designs per reaction

### 3. **Prediction Layer**
- GNNs/MLIPs for catalysis properties (activity, selectivity, stability)
- Flux balance + ML for metabolic pathways
- Ranking by predicted performance

### 4. **Visualization Layer**
- Interactive 3D molecular viewers
- Performance plots and reaction energy diagrams
- Pathway maps with bottlenecks

### 5. **Feedback & Learning Layer**
- Structured experiment logging form
- Predicted vs. actual comparison
- Automatic model retraining with safeguards

## Project Structure

```
catalyst/
├── backend/
│   ├── app/
│   │   ├── core/              # Configuration, logging, utilities
│   │   ├── layers/            # Knowledge, Generative, Prediction, Visualization, Feedback
│   │   ├── api/               # API routes and endpoints
│   │   ├── db/                # Database models and schemas
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   └── main.py            # FastAPI application entry point
│   ├── tests/                 # Unit and integration tests
│   ├── requirements.txt       # Python dependencies
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API client
│   │   ├── styles/            # CSS (white/black theme)
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
├── .env                       # Environment variables
└── docker-compose.yml         # Optional: containerization
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173` or `http://localhost:3000`

## Core Workflow Demo

### Step 1: Target Reaction Input
User enters a target reaction (e.g., "CO₂ + H₂ → Methanol")

**Endpoint:** `POST /api/reactions/search`
```json
{
  "reactants": ["CO2", "H2"],
  "products": ["Methanol"],
  "conditions": {
    "temperature": 250,
    "pressure": 50,
    "solvent": "water"
  }
}
```

### Step 2: Knowledge Retrieval
Platform retrieves 23 known catalysts from scientific databases

**Endpoint:** `GET /api/catalysts/retrieved`

### Step 3: Generative Design
AI generates 8 novel candidate designs based on top performers

**Endpoint:** `POST /api/catalysts/generate`
```json
{
  "base_catalyst": "Cu-Zn-Al",
  "num_variants": 8,
  "optimization_target": "activity"
}
```

### Step 4: Prediction & Ranking
Predicts and ranks all 31 candidates (23 known + 8 novel)

**Endpoint:** `POST /api/predictions/rank`
```json
{
  "candidates": [...],
  "metrics": ["activity", "selectivity", "stability"]
}
```

### Step 5: Visualization
Interactive dashboard with 3D molecular structures and performance plots

**Endpoint:** `GET /api/visualization/candidates`

### Step 6: Experimental Export
Export top 5 candidates for synthesis and testing

**Endpoint:** `POST /api/experiments/export`

### Step 7: Feedback Loop
Log experimental results and trigger model retraining

**Endpoint:** `POST /api/feedback/log-results`
```json
{
  "catalyst_id": "cat_001",
  "measured_activity": 45.2,
  "measured_selectivity": 92.1,
  "notes": "Sample observations"
}
```

## Key Features

✅ **End-to-End Discovery**: From reaction query to feedback loop
✅ **Knowledge Integration**: Scientific database retrieval
✅ **AI-Powered Generation**: Novel catalyst/enzyme design
✅ **Multi-Metric Prediction**: Activity, selectivity, stability
✅ **Interactive Visualization**: 3D molecules, plots, pathways
✅ **Experimental Feedback**: Log results and retrain models
✅ **Simple UI**: Clean white/black theme optimized for mobile
✅ **Full Attribution**: Track all results with version history

## Case Study: Ethanol-to-Jet Conversion

1. **Query**: Researcher inputs "ethanol + H₂ → jet fuel"
2. **Retrieval**: 23 known catalysts retrieved
3. **Generation**: 8 novel variants generated
4. **Prediction**: All 31 ranked by predicted activity
5. **Visualization**: Top candidates displayed interactively
6. **Export**: Top 5 selected for 3-week bench testing
7. **Results**: 2 exceeded predictions, 1 matched, 2 underperformed
8. **Analysis**: System flags underperformers and highlights structural features
9. **Retraining**: Models updated with new experimental data
10. **Follow-up**: Junior researcher proposes validation experiment

## Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ML/AI**: PyTorch, scikit-learn, RDKit
- **Visualization**: Plotly, NumPy, SciPy

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite / Webpack
- **3D Viewer**: Plotly (2D/3D), future integration with 3Dmol.js
- **Styling**: Tailwind CSS with white/black theme
- **State Management**: React Context / Redux (if needed)

## Data Quality & Safeguards

| Risk | Mitigation |
|------|-----------|
| Invalid generated structures | Valency/steric checks + SME review gate |
| Model degradation | A/B testing and rollback capability |
| Data scarcity | Transfer learning + active learning |
| Over-reliance on AI | Prominent uncertainty scores + human-in-loop |

## Development Roadmap

### Hackathon MVP (Current)
- ✅ Core workflow: retrieval → generation → prediction → visualization → feedback
- ✅ Single focused reaction (ethanol-to-jet)
- ✅ Basic experiment logging form
- ✅ Predicted vs. actual comparison
- ✅ Full-cycle demo with discrepancy highlighting

### Phase 2 (Extended Pilot)
- Multiple reaction support
- Advanced generative models (full diffusion/GNN implementation)
- Metabolic pathway support
- Multi-user collaboration & role-based access
- Laboratory integration (hardware APIs)
- Production database (PostgreSQL)
- Advanced experiment tracking (MLflow integration)
- Batch processing for high-throughput screening

### Phase 3 (Production)
- Distributed training pipeline
- Real-time model serving
- Advanced uncertainty quantification
- Federated learning (data privacy)
- Full MLOps pipeline
- Compliance & audit logging
- Integration with ELN (Electronic Lab Notebook) systems

## API Documentation

See `/backend/app/api/` for route implementations and detailed endpoint documentation.

## Testing

```bash
cd backend
pytest tests/
```

## Contributing

1. Follow PEP 8 style guidelines
2. Add tests for new features
3. Update documentation
4. Use meaningful commit messages

## License

Proprietary - GPS Renewables

---

**Contact**: For questions or collaboration, please reach out to the development team.
