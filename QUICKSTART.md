# Quick Start Guide

## 🚀 Launch in 5 Minutes

### Terminal 1: Start Backend

```bash
cd catalyst/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

✅ Backend running at: http://localhost:8000

### Terminal 2: Start Frontend

```bash
cd catalyst/frontend
npm install
npm run dev
```

✅ Frontend running at: http://localhost:5173

### 🌐 Open in Browser

**Application**: http://localhost:5173  
**API Docs**: http://localhost:8000/docs

---

## 📖 Complete Workflow Demo

### Step 1: Enter Target Reaction
- Click "🚀 Start Discovery Pipeline"
- Default: "CO₂ + H₂ → Methanol" (editable)
- Reaction conditions pre-filled

### Step 2: Retrieve Known Catalysts
- System queries scientific databases
- Retrieves 23 known catalysts (Cu-Zn-Al oxide, Pt/C, Pd/Al₂O₃, etc.)

### Step 3: Generate Novel Variants
- AI creates 8 novel catalyst variants
- Modifications: doping, substitution, composition shift, support changes
- Each variant includes confidence score

### Step 4: Predict & Rank
- Predicts activity, selectivity, stability for all 31 candidates
- Ranks by combined score
- Shows uncertainty estimates

### Step 5: View Results
- Interactive ranking table
- Top 5 recommendations
- Performance metrics for each catalyst

### Step 6: Export for Testing
- Select top 5 catalysts
- Export for synthesis and testing
- Includes structure data and predicted properties

### Step 7: Log Experimental Results (3 weeks later)
- Enter measured activity, selectivity, stability
- System compares predicted vs actual
- Generates hypothesis about deviations

### Step 8: Analyze Discrepancies
- View deviation analysis
- Read system-generated hypothesis
- Understand why predictions differed
- Trigger model retraining if significant deviations

---

## 📁 Project Structure

```
catalyst/
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── core/              # Config, logging, utils
│   │   ├── layers/            # 5 core layers
│   │   │   ├── knowledge_layer.py      (retrieval)
│   │   │   ├── generative_layer.py     (generation)
│   │   │   ├── prediction_layer.py     (prediction)
│   │   │   ├── visualization_layer.py  (visualization)
│   │   │   └── feedback_layer.py       (feedback & retraining)
│   │   ├── api/               # REST endpoints
│   │   ├── db/                # Database
│   │   ├── models/            # ORM models
│   │   └── main.py            # FastAPI app
│   ├── requirements.txt
│   ├── README.md
│   └── Dockerfile
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client
│   │   ├── styles/            # White/black theme
│   │   ├── App.tsx            # Main component
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── README.md
│   └── Dockerfile
│
├── README.md                   # Main documentation
├── SETUP.md                    # Installation guide
├── ARCHITECTURE.md             # System design
├── docker-compose.yml          # Docker orchestration
└── .env                        # Environment variables
```

---

## 🎨 UI Features

### White & Black Theme
- Clean, minimal design
- High contrast for readability
- Responsive mobile layout
- No external UI frameworks

### Key Components
1. **Reaction Input Form**: Temperature, pressure, reactants/products
2. **Catalyst Cards**: Display properties with ranking badges
3. **Performance Plot**: Activity vs Selectivity (colored by Stability)
4. **Ranking Table**: Sortable catalyst list
5. **Experiment Logger**: Pre-filled with predictions
6. **Discrepancy Analysis**: Visual deviation comparison
7. **Status Badges**: Track workflow progress

---

## 🔧 API Endpoints

### Reactions
- `POST /api/reactions/` - Create new reaction
- `GET /api/reactions/{id}` - Get reaction details

### Catalysts
- `POST /api/catalysts/retrieve` - Retrieve known catalysts
- `POST /api/catalysts/generate` - Generate variants

### Predictions
- `POST /api/predictions/rank` - Rank all candidates
- `GET /api/predictions/model-info` - Model details

### Visualization
- `POST /api/visualization/performance-plot` - Plot data
- `POST /api/visualization/ranking-table` - Table data

### Experiments
- `POST /api/experiments/log-results` - Log outcomes
- `POST /api/experiments/trigger-retraining` - Retrain model
- `GET /api/experiments/retraining-history` - View history

---

## 📊 Example Outputs

### Ranked Catalysts
```
Rank 1: Cu-Zn-Al_V1
  - Activity: 80.5%
  - Selectivity: 91.2%
  - Stability: 87.3%
  - Score: 86.3
  - Uncertainty: ±12%

Rank 2: Cu-Zn-Al Oxide
  - Activity: 72.5%
  - Selectivity: 88.0%
  - Stability: 85.0%
  - Score: 81.8
  - Uncertainty: ±8%
```

### Discrepancy Analysis
```
Status: ⭐ Verified Outperformer

Property Deviations:
- Activity: Predicted 50.0% → Measured 45.2% (-4.8%)
- Selectivity: Predicted 85.0% → Measured 92.1% (+7.1%)
- Stability: Predicted 90.0% → Measured 88.5% (-1.5%)

Hypothesis:
"Model underestimated selectivity. Possible surface 
reconstruction or adsorbate-adsorbate interactions not 
captured in the model."

Recommendation: Trigger model retraining to improve 
selectivity predictions for this reaction class.
```

---

## 🧪 Case Study: Ethanol-to-Jet Fuel

### Input
```
Reaction: Ethanol + H₂ → Jet fuel
Temperature: 250 K
Pressure: 50 atm
Solvent: Water
```

### Retrieved (23 known)
- Cu-Zn-Al Oxide (activity: 72.5)
- Ni-Mo-S (activity: 62.0)
- Pt/C (activity: 85.0)
- ... 20 more catalysts

### Generated (8 variants)
- Cu-Zn-Al_V1 (Cu dopant, predicted +8% activity)
- Cu-Zn-Al_V2 (Ni substitution, predicted +12% activity)
- ... 6 more variants

### Ranked Top 5
1. Pt/C (score: 87.3)
2. Cu-Zn-Al_V2 (score: 86.5)
3. Cu-Zn-Al Oxide (score: 81.8)
4. Cu-Zn-Al_V1 (score: 80.2)
5. Ni-Mo-S (score: 78.1)

### After 3 Weeks of Testing
- Pt/C: Excellent (measured 82% vs predicted 85%)
- Cu-Zn-Al_V2: Outperformed (measured 88% vs predicted 78%)
- Cu-Zn-Al: Normal (measured 73% vs predicted 72.5%)
- Cu-Zn-Al_V1: Underperformed (measured 55% vs predicted 80%)
- Ni-Mo-S: Normal (measured 61% vs predicted 62%)

### System Response
- Flags Cu-Zn-Al_V1 as anomaly
- Flags Cu-Zn-Al_V2 as outperformer
- Hypothesis: "Steric effects dominate over electronic properties for V1"
- Recommendation: Retrain with new data
- Version upgraded: v1.0 → v1.1

---

## 🔄 Continuous Improvement Loop

```
Iteration 1:
  Input → Retrieve (23) → Generate (8) → Predict (31) 
  → Visualize → Export → Test → Feedback
          ↓
  Discrepancy Analysis: Cu-Zn-Al_V2 outperformed
          ↓
  Model Retraining: v1.0 → v1.1
          ↓
Iteration 2 (with improved model):
  Input → Retrieve (23) → Generate (8) → Predict (31)
         [Better predictions for similar structures]
          ↓
  Higher confidence scores
  Fewer anomalies
  Faster convergence to optimal design
```

---

## 🛠️ Development

### Adding a New Endpoint

1. **Backend** (`app/api/new_feature.py`):
   ```python
   @router.post("/new-endpoint")
   def new_endpoint(data: InputSchema):
       result = some_layer.process(data)
       return result
   ```

2. **Update** `app/main.py`:
   ```python
   from app.api import new_feature
   app.include_router(new_feature.router)
   ```

3. **Frontend** (`src/services/api.ts`):
   ```typescript
   export const newService = {
       newEndpoint: (data) => apiClient.post('/api/new-endpoint', data)
   }
   ```

4. **Component** (`src/components/NewFeature.tsx`):
   ```typescript
   const result = await newService.newEndpoint(data);
   ```

---

## 📚 Documentation

- **Main README**: [README.md](README.md) - Overview & features
- **Setup Guide**: [SETUP.md](SETUP.md) - Installation steps
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- **Backend**: [backend/README.md](backend/README.md) - API details
- **Frontend**: [frontend/README.md](frontend/README.md) - UI components
- **This Guide**: Quick start & examples

---

## 💡 Tips

### Debugging
- **Backend logs**: Check terminal where Uvicorn is running
- **Frontend logs**: Open browser DevTools (F12 → Console)
- **API errors**: Check http://localhost:8000/docs

### Performance
- Backend predictions: ~50ms per catalyst
- Frontend rendering: <100ms for 31 candidates
- Total workflow: <5 seconds for complete analysis

### Customization
- Edit reaction conditions in `ReactionInput.tsx`
- Adjust weights in `predictions/rank` endpoint
- Change colors in `src/styles/global.css`
- Add database fields in `models/models.py`

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python 3.11+, reinstall requirements.txt |
| Frontend blank page | Check console (F12), verify API_URL in .env |
| API errors | View docs at http://localhost:8000/docs |
| Database issues | Delete catalyst.db, restart backend |

---

## 🎯 Next Steps

1. ✅ Start both servers (see above)
2. ✅ Open http://localhost:5173
3. ✅ Try a reaction query
4. ✅ Export top candidates
5. ✅ Log experimental results
6. ✅ Trigger model retraining
7. 📖 Read [ARCHITECTURE.md](ARCHITECTURE.md) for deep dive
8. 🔧 Customize for your use case

---

**Happy Discovering! 🧪🚀**

For detailed documentation, see README.md and ARCHITECTURE.md
