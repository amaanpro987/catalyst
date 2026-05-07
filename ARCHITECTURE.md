# Architecture & System Design

## End-to-End Workflow

```
INPUT PHASE
└─ Researcher enters target reaction
   ├─ Reactants & Products
   ├─ Reaction conditions (Temperature, Pressure, Solvent)
   └─ Optimization target (Activity, Selectivity, or Stability)

KNOWLEDGE RETRIEVAL PHASE
└─ Knowledge Layer queries scientific databases
   ├─ Materials Project API
   ├─ Open Catalyst Project (OC20/OC22)
   ├─ BRENDA enzyme database
   ├─ UniProt protein sequences
   └─ Internal experiment database
   → Returns: 23 known catalysts

GENERATIVE DESIGN PHASE
└─ Generative Layer creates novel variants
   ├─ Base catalyst selection
   ├─ Modification types:
   │  ├─ Doping (Add non-metal dopants)
   │  ├─ Substitution (Element replacement)
   │  ├─ Composition shift (Adjust ratios)
   │  └─ Support change (Different support material)
   ├─ Valency & steric validation
   └─ SME review gate for novel structures
   → Returns: 8 generated variants + confidence scores

PREDICTION PHASE
└─ Prediction Layer forecasts properties
   ├─ For each of 31 candidates (23 known + 8 generated):
   │  ├─ Predicted Activity (0-100%)
   │  ├─ Predicted Selectivity (0-100%)
   │  ├─ Predicted Stability (0-100%)
   │  ├─ Turnover Frequency
   │  └─ Uncertainty estimate (±%)
   ├─ Reaction conditions effect
   ├─ Model: SchNet/DimeNet-style GNN
   └─ Ranking by combined score
   → Returns: Ranked predictions with uncertainties

VISUALIZATION PHASE
└─ Visualization Layer formats data for UI
   ├─ 3D molecular structures (for 3Dmol.js/Plotly)
   ├─ Performance plots (Activity vs Selectivity colored by Stability)
   ├─ Ranking table with sortable columns
   ├─ Uncertainty visualization
   ├─ Energy reaction diagrams
   └─ Dashboard summary statistics
   → Returns: Interactive visualizations

EXPORT PHASE
└─ Researcher selects top 5 candidates
   ├─ Export formats: JSON, CSV, PDB, SMILES
   ├─ Includes full structure data
   ├─ Predicted properties with uncertainties
   ├─ Recommended synthesis parameters
   └─ Experimental protocol suggestions
   → Returns: Synthesis-ready export files

FEEDBACK PHASE (3 weeks later)
└─ Researcher logs experimental results
   ├─ Measured Activity, Selectivity, Stability
   ├─ Yield percentage
   ├─ Researcher name & observations
   └─ Reference to predictions
   → Triggers: Discrepancy Analysis

ANALYSIS & LEARNING PHASE
└─ Feedback Layer analyzes deviations
   ├─ Calculates predicted vs actual differences
   ├─ Identifies anomalies
   │  ├─ Verified outperformers (exceeded by 20%+)
   │  ├─ Normal (within ±20%)
   │  └─ Anomalies (underperformed by 20%+)
   ├─ Generates human-readable hypotheses
   │  ├─ "Steric hindrance underestimated"
   │  ├─ "Surface reconstruction not captured"
   │  └─ "Surface impurities present"
   ├─ Flags systematic errors
   └─ Recommends model retraining
   → Returns: Discrepancy Analysis Report

RETRAINING PHASE
└─ Feedback Layer triggers model retraining
   ├─ Quality gates:
   │  ├─ Minimum 5 quality data points
   │  ├─ Exclude anomalies (unless SME verified)
   │  └─ Data drift detection
   ├─ A/B testing: Old model vs New model
   ├─ Version management: v1.0 → v1.1
   ├─ Rollback capability if performance degrades
   └─ Update production model
   → Returns: New model version with improved predictions

LOOP CONTINUES
└─ New iteration with updated model
   ├─ Better predictions for similar reactions
   ├─ Full attribution & version history tracked
   ├─ Junior researchers propose follow-up experiments
   └─ Collaborative feedback accumulates
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Input UI   │  │ Ranking View │  │  Experiment Logger   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     Performance Plots (Plotly) + Discrepancy Analysis    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Theme: White background, Black text, Simple design      │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST API
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND (FastAPI + Python 3.11)                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Layer (FastAPI)                  │   │
│  │  /api/reactions  /api/catalysts  /api/predictions      │   │
│  │  /api/visualization  /api/experiments                  │   │
│  └──────────────┬──────────────────────────────────────┬──┘   │
│                 │                                      │        │
│  ┌──────────────▼────────────────────────────────────┬─▼──┐    │
│  │            FIVE CORE LAYERS                      │    │    │
│  │                                                  │    │    │
│  │ 1. Knowledge Layer                              │    │    │
│  │    ├─ Scientific database retrieval             │    │    │
│  │    └─ 23 known catalysts (mock/real APIs)       │    │    │
│  │                                                  │    │    │
│  │ 2. Generative Layer                             │    │    │
│  │    ├─ GNN + Diffusion models                    │    │    │
│  │    └─ 8 novel variant generation                │    │    │
│  │                                                  │    │    │
│  │ 3. Prediction Layer                             │    │    │
│  │    ├─ SchNet/DimeNet GNNs                       │    │    │
│  │    ├─ Property prediction & ranking             │    │    │
│  │    └─ Uncertainty estimation                    │    │    │
│  │                                                  │    │    │
│  │ 4. Visualization Layer                          │    │    │
│  │    ├─ Plotly data formatting                    │    │    │
│  │    ├─ 3D molecular structure preparation        │    │    │
│  │    └─ Interactive dashboard data                │    │    │
│  │                                                  │    │    │
│  │ 5. Feedback & Learning Layer                    │    │    │
│  │    ├─ Experiment result logging                 │    │    │
│  │    ├─ Discrepancy analysis & hypothesis gen.    │    │    │
│  │    └─ Model retraining with safeguards          │    │    │
│  │                                                  │    │    │
│  └──────────────────────────────────────────────────┘    │    │
│                                                           │    │
│  ┌───────────────────────────────────────────────────────┘    │
│  │                    Data Layer                          │    │
│  │  ┌─────────────┐  ┌────────────┐  ┌─────────────────┐    │
│  │  │  SQLite/    │  │  Scientific│  │   Experimental  │    │
│  │  │ PostgreSQL  │  │  Databases │  │     Database    │    │
│  │  └─────────────┘  └────────────┘  └─────────────────┘    │
│  └───────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Single Workflow Cycle

```
User Input (Reaction)
    │
    └─→ Knowledge Layer
        │
        ├─→ Search databases: Materials Project, Open Catalyst, BRENDA
        │
        └─→ Return: 23 known catalysts
            {
              "id": "cat_001",
              "name": "Cu-Zn-Al Oxide",
              "composition": "Cu0.6Zn0.2Al0.2",
              "activity": 72.5,
              "selectivity": 88.0,
              "stability": 85.0
            }

    │
    └─→ Generative Layer
        │
        ├─→ Select base: Cu-Zn-Al
        ├─→ Create 8 variants:
        │   - Cu-Zn-Al + N doping
        │   - Cu-Zn-Al (Ni→Pd substitution)
        │   - Cu-Zn-Al (High-Cu composition)
        │   - etc.
        │
        └─→ Return: 8 generated catalysts
            {
              "id": "gen_001",
              "name": "Cu-Zn-Al_V1",
              "composition": "Cu0.6Zn0.2Al0.2+N",
              "predicted_activity": 80.5,
              "confidence": 0.75
            }

    │
    └─→ Prediction Layer
        │
        ├─→ For each of 31 catalysts:
        │   - Input: composition, reaction conditions
        │   - Model: SchNet GNN
        │   - Output: activity, selectivity, stability, uncertainty
        │
        └─→ Return: Ranked predictions
            {
              "rank": 1,
              "catalyst_name": "Cu-Zn-Al_V1",
              "activity": 80.5,
              "selectivity": 91.2,
              "stability": 87.3,
              "combined_score": 86.3,
              "uncertainty": 0.12
            }

    │
    └─→ Visualization Layer
        │
        ├─→ Format for UI:
        │   - Performance plot data
        │   - Ranking table
        │   - 3D structure
        │   - Dashboard summary
        │
        └─→ Return: UI-ready data

    │
    └─→ Frontend Display
        │
        ├─→ Interactive performance plot
        ├─→ Sortable ranking table
        └─→ Select top 5 for export

    │
    └─→ Researcher exports for testing
        │
        └─→ 3 weeks of bench testing...

    │
    └─→ Feedback Loop
        │
        ├─→ Log experimental results
        │   Measured activity: 45.2 (vs predicted 50.0)
        │   Measured selectivity: 92.1 (vs predicted 85.0)
        │   → Deviation: -4.8% activity, +7.1% selectivity
        │
        ├─→ Feedback Layer analyzes:
        │   - Status: VERIFIED_OUTPERFORMER (selectivity++)
        │   - Hypothesis: "Model underestimated selectivity; 
        │     possibly due to unaccounted surface reconstruction"
        │
        └─→ If significant deviations:
            └─→ Trigger retraining
                ├─→ Quality filter: Include if status = normal or outperformer
                ├─→ Min samples: Need 5+ quality experiments
                ├─→ Version: v1.0 → v1.1
                └─→ A/B test before deployment
```

## Database Schema

```
Reactions
├── id (PK)
├── name
├── reactants (JSON)
├── products (JSON)
├── temperature, pressure, solvent
└── timestamps

Catalysts
├── id (PK)
├── reaction_id (FK)
├── name, composition
├── source ('known' or 'generated')
├── confidence (0-1)
└── structure_data (JSON)

Predictions
├── id (PK)
├── reaction_id (FK)
├── catalyst_id (FK)
├── activity, selectivity, stability
├── uncertainty
└── model_version

Experiments
├── id (PK)
├── reaction_id (FK)
├── catalyst_id (FK)
├── measured_properties
├── deviations (calculated)
├── hypothesis (generated)
├── status ('normal', 'outperformer', 'anomaly')
└── researcher_name

ModelVersions
├── version (PK)
├── model_type
├── accuracy_score
├── training_samples
├── status ('active', 'archived', 'testing')
└── training_completed_at
```

## Key Design Decisions

### 1. **Five-Layer Architecture**
- Separation of concerns: each layer has clear responsibility
- Modularity: layers can be updated independently
- Testability: each layer can be tested in isolation
- Scalability: layers can be distributed across services

### 2. **Mock Data for MVP**
- 23 curated known catalysts (realistic but mockable)
- 8 generative variants with heuristic improvements
- Predictions with realistic uncertainty ranges
- Demo focuses on workflow, not production accuracy

### 3. **Quality Safeguards for Retraining**
- Minimum 5 verified data points before retraining
- Exclude anomalies unless SME-verified
- Version management with rollback
- A/B testing before deploying new model
- Prevents model degradation from bad data

### 4. **White/Black Minimalist UI**
- Clean, distraction-free design
- Accessible on mobile browsers
- Focus on data, not aesthetics
- High contrast for readability
- No external CSS frameworks for simplicity

### 5. **API-First Design**
- Frontend and backend loosely coupled
- Easy to swap frontend (mobile app, Jupyter, etc.)
- RESTful endpoints for each workflow stage
- Comprehensive error handling
- Swagger/OpenAPI documentation

## Feedback Loop Workflow

```
Experiment Results → Discrepancy Analysis
       ↓
Predicted vs Actual Comparison
       ↓
Classify Status (Normal / Outperformer / Anomaly)
       ↓
Generate Hypothesis
       ↓
If significant deviation detected:
    ├─ Quality filter: Keep only verified data
    ├─ Check: Do we have ≥5 samples?
    ├─ If NO: Queue and wait for more data
    └─ If YES:
        ├─ Create new model version
        ├─ Train with filtered data
        ├─ A/B test old vs new
        ├─ If new is better: Deploy
        └─ If new is worse: Rollback
       ↓
Track Version History
       ↓
Propose Follow-up Experiment
       ↓
Loop continues...
```

## Deployment Architecture

### Local Development
```
localhost:5173 (Frontend)
    ↓
localhost:8000 (Backend)
    ↓
SQLite (Local Database)
```

### Docker Development
```
Frontend Container (Node 18)
    ↓
Backend Container (Python 3.11)
    ↓
PostgreSQL Container
    ├─ PgAdmin Container
    └─ Shared network
```

### Production Deployment
```
Client Browser
    ↓
Nginx/Apache (Reverse Proxy)
    ├─ Static files (/dist)
    └─ API proxy (/api → Gunicorn)
        ↓
    Gunicorn (4+ workers)
        ↓
    PostgreSQL (Production DB)
        ├─ Connection pooling
        └─ Automated backups
```

## Technology Choices & Justification

| Component | Choice | Why |
|-----------|--------|-----|
| Backend Framework | FastAPI | Modern, fast, auto-docs, async support |
| Database | SQLite (dev) / PostgreSQL (prod) | Simplicity for MVP, scalability for prod |
| Frontend | React + TypeScript | Type safety, component reusability, large ecosystem |
| Build Tool | Vite | Fast development, optimized builds, modern |
| Visualization | Plotly | Interactive 2D/3D, white/black theme support |
| Chemistry | RDKit | Open-source, mature, SMILES/structure handling |
| ML/AI | PyTorch | Industry standard, GNN support, active development |
| API Docs | Swagger/OpenAPI | Auto-generated, interactive, comprehensive |
| Containerization | Docker | Reproducible environments, easy deployment |

## Identified Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Model degradation | Bad predictions | A/B testing, quality gates, rollback capability |
| Data scarcity | Low accuracy | Transfer learning, active learning, synthetic data |
| Invalid structures | Synthesis failure | Valency checks, steric validation, SME review |
| Over-reliance on AI | Wrong decisions | Uncertainty quantification, human-in-loop gates |
| Data bias | Systematic errors | Diverse training data, benchmarking, regular audits |
| Model drift | Performance decay | Continuous monitoring, periodic retraining |
| Computational cost | Slow predictions | Batching, caching, GPU acceleration option |
| Privacy concerns | Data leak | Data anonymization, access control, encryption |

---

**Document Version**: 1.0  
**Last Updated**: May 5, 2026  
**Status**: MVP Complete
