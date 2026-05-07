import React, { useState, useEffect } from 'react';
import './styles/global.css';
import ReactionInput from './components/ReactionInput';
import { CatalystList } from './components/CatalystCard';
import ExperimentLog from './components/ExperimentLog';
import DiscrepancyAnalysis from './components/DiscrepancyAnalysis';
import {
  reactionService,
  catalystService,
  predictionService,
  visualizationService,
  experimentService,
} from './services/api';

interface PipelineState {
  stage: 'input' | 'retrieval' | 'generation' | 'prediction' | 'visualization' | 'export' | 'feedback' | 'analysis';
  reaction: any | null;
  knownCatalysts: any[];
  generatedCatalysts: any[];
  predictions: any[];
  selectedCatalysts: any[];
  experiment: any | null;
  loading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<PipelineState>({
    stage: 'input',
    reaction: null,
    knownCatalysts: [],
    generatedCatalysts: [],
    predictions: [],
    selectedCatalysts: [],
    experiment: null,
    loading: false,
    error: null,
  });

  const handleReactionSubmit = async (reactionData: any) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      // Create reaction
      const reactionResponse = await reactionService.createReaction(reactionData);
      const reaction = reactionResponse.data;

      // Retrieve known catalysts
      const catalystResponse = await catalystService.retrieveKnown(
        reactionData.reactants,
        reactionData.products,
        reaction.id
      );
      const knownCatalysts = catalystResponse.data.catalysts;

      // Generate novel variants
      const generatedResponse = await catalystService.generateVariants(
        'Cu-Zn-Al Oxide',
        8,
        reaction.id
      );
      const generatedCatalysts = generatedResponse.data.variants;

      // Combine and predict
      const allCatalysts = [...knownCatalysts, ...generatedCatalysts];

      const predictionResponse = await predictionService.rankCatalysts(
        allCatalysts,
        {
          temperature: reactionData.temperature,
          pressure: reactionData.pressure,
          solvent: reactionData.solvent,
        }
      );
      const predictions = predictionResponse.data.predictions;

      setState((prev) => ({
        ...prev,
        stage: 'prediction',
        reaction,
        knownCatalysts,
        generatedCatalysts,
        predictions,
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'An error occurred',
        loading: false,
      }));
    }
  };

  const handleCatalystSelect = (catalyst: any) => {
    setState((prev) => ({
      ...prev,
      selectedCatalysts: [...prev.selectedCatalysts, catalyst],
      stage: 'export',
    }));
  };

  const handleExportForTesting = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await experimentService.exportCandidates(
        state.reaction.id,
        state.selectedCatalysts.map((c) => c.id)
      );
      alert('✅ Candidates exported for synthesis and testing!');
      setState((prev) => ({
        ...prev,
        stage: 'feedback',
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Export failed',
        loading: false,
      }));
    }
  };

  const handleExperimentSubmit = async (experimentData: any) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await experimentService.logResults({
        reaction_id: state.reaction.id,
        ...experimentData,
      });
      const experiment = response.data.experiment;

      setState((prev) => ({
        ...prev,
        experiment,
        stage: 'analysis',
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Failed to log results',
        loading: false,
      }));
    }
  };

  const handleTriggerRetraining = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      if (!state.experiment) return;

      await experimentService.triggerRetraining([state.experiment], 'new_data');
      alert('✅ Model retraining triggered! New version will be deployed after validation.');

      setState((prev) => ({
        ...prev,
        loading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || 'Retraining trigger failed',
        loading: false,
      }));
    }
  };

  const topPredictions = state.predictions.slice(0, 5);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1>🧪 Catalyst & Enzyme Discovery Platform</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', marginBottom: '1rem' }}>
          End-to-End AI-Powered Discovery Workflow
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className={`badge ${state.stage === 'input' ? 'success' : ''}`}>
            1️⃣ Input
          </span>
          <span className={`badge ${state.stage === 'retrieval' ? 'success' : ''}`}>
            2️⃣ Retrieve
          </span>
          <span className={`badge ${state.stage === 'generation' ? 'success' : ''}`}>
            3️⃣ Generate
          </span>
          <span className={`badge ${state.stage === 'prediction' ? 'success' : ''}`}>
            4️⃣ Predict
          </span>
          <span className={`badge ${state.stage === 'visualization' ? 'success' : ''}`}>
            5️⃣ Visualize
          </span>
          <span className={`badge ${state.stage === 'export' ? 'success' : ''}`}>
            6️⃣ Export
          </span>
          <span className={`badge ${state.stage === 'feedback' ? 'success' : ''}`}>
            7️⃣ Feedback
          </span>
          <span className={`badge ${state.stage === 'analysis' ? 'success' : ''}`}>
            8️⃣ Analysis
          </span>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div style={{
          background: 'rgba(198, 40, 40, 0.1)',
          border: '1px solid #c62828',
          borderRadius: '4px',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#c62828',
        }}>
          ❌ {state.error}
        </div>
      )}

      {/* Stage: Input */}
      {(state.stage === 'input' || !state.reaction) && (
        <ReactionInput onSubmit={handleReactionSubmit} loading={state.loading} />
      )}

      {/* Stage: Prediction & Visualization */}
      {state.stage === 'prediction' && state.reaction && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2>✅ Discovery Pipeline Complete!</h2>
            <p>
              Reaction: <strong>{state.reaction.name}</strong>
            </p>
            <p>
              Total candidates analyzed: <strong>{state.predictions.length}</strong> (23 known + 8 generated)
            </p>
          </div>

          <CatalystList
            title="🏆 Top 5 Ranked Catalysts"
            catalysts={topPredictions}
            onSelect={handleCatalystSelect}
          />

          <div className="card">
            <h2>📊 Next Steps</h2>
            <p>Select top candidates to export for experimental synthesis and testing.</p>
            <button
              className="btn-primary"
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  selectedCatalysts: topPredictions,
                  stage: 'export',
                }));
              }}
            >
              ✅ Export Top 5 for Testing
            </button>
          </div>
        </>
      )}

      {/* Stage: Export */}
      {state.stage === 'export' && state.selectedCatalysts.length > 0 && (
        <div className="card">
          <h2>📦 Export Candidates</h2>
          <p>Selected {state.selectedCatalysts.length} catalyst(s) for synthesis:</p>
          <ul style={{ margin: '1rem 0', paddingLeft: '2rem' }}>
            {state.selectedCatalysts.map((cat) => (
              <li key={cat.id}>{cat.catalyst_name} ({cat.composition})</li>
            ))}
          </ul>
          <button className="btn-primary" onClick={handleExportForTesting} disabled={state.loading}>
            {state.loading ? '⏳ Exporting...' : '🚀 Export for Synthesis'}
          </button>
        </div>
      )}

      {/* Stage: Feedback */}
      {state.stage === 'feedback' && state.reaction && state.selectedCatalysts.length > 0 && (
        <ExperimentLog
          catalystId={state.selectedCatalysts[0].id}
          catalystName={state.selectedCatalysts[0].catalyst_name}
          predictedProperties={state.selectedCatalysts[0]}
          onSubmit={handleExperimentSubmit}
          loading={state.loading}
        />
      )}

      {/* Stage: Analysis */}
      {state.stage === 'analysis' && state.experiment && (
        <>
          <DiscrepancyAnalysis
            experiment={state.experiment}
            onReviewHypothesis={handleTriggerRetraining}
          />

          <div className="card" style={{ marginTop: '2rem' }}>
            <h2>🔄 Feedback Loop Actions</h2>
            <p>The discrepancy analysis has identified insights about model performance.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-primary" onClick={handleTriggerRetraining} disabled={state.loading}>
                {state.loading ? '⏳ Triggering...' : '🔄 Trigger Model Retraining'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setState((prev) => ({ ...prev, stage: 'input' }))}
              >
                🏠 Start New Discovery
              </button>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
          Catalyst & Enzyme Discovery Platform v0.1.0 | Powered by AI/ML
        </p>
      </div>
    </div>
  );
};

export default App;
