# Frontend - Catalyst Discovery Platform

React-based web frontend for the Catalyst & Enzyme Discovery Platform with white/black theme.

## Features

- **Reaction Input**: Submit target reactions with reaction conditions
- **Catalyst Visualization**: Interactive cards for known and generated catalysts
- **Ranking Display**: Top candidates ranked by predicted performance
- **Experiment Logging**: Log experimental results with easy comparison to predictions
- **Discrepancy Analysis**: View system-generated hypotheses about model performance
- **Responsive Design**: Works on desktop and mobile browsers

## Quick Start

```bash
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/        # React components
│   ├── ReactionInput.tsx      # Reaction query form
│   ├── CatalystCard.tsx       # Catalyst display cards
│   ├── ExperimentLog.tsx      # Experiment logging form
│   └── DiscrepancyAnalysis.tsx # Analysis visualization
├── pages/            # Page components
├── services/         # API client
│   └── api.ts       # Backend API integration
├── styles/          # CSS styles
│   ├── global.css   # Global theme (white/black)
│   └── components.css # Component styles
├── App.tsx          # Main application component
└── main.tsx         # Entry point
```

## Theme

- **Background**: White (#ffffff)
- **Text**: Black (#000000)
- **Primary**: Black (#000000)
- **Surface**: Light gray (#f5f5f5)
- **Border**: Light gray (#e0e0e0)

## API Integration

The frontend communicates with the FastAPI backend via `/services/api.ts`:

- `reactionService` - Manage reactions
- `catalystService` - Retrieve and generate catalysts
- `predictionService` - Get predictions and rankings
- `visualizationService` - Format data for display
- `experimentService` - Log results and trigger retraining

## Responsive Design

- Desktop: Full-featured layout
- Tablet: Adjusted grid layout
- Mobile: Single-column layout with touch-friendly buttons

## Build for Production

```bash
npm run build
```

Outputs to `dist/` directory.
