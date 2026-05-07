import React from 'react';
import '../styles/components.css';

interface DiscrepancyAnalysisProps {
  experiment: any;
  onReviewHypothesis?: () => void;
}

export const DiscrepancyAnalysis: React.FC<DiscrepancyAnalysisProps> = ({
  experiment,
  onReviewHypothesis,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified_outperformer':
        return 'success';
      case 'anomaly':
        return 'error';
      default:
        return 'normal';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified_outperformer':
        return '⭐ Excellent Performer';
      case 'anomaly':
        return '⚠️ Anomaly Detected';
      default:
        return '✓ Normal';
    }
  };

  return (
    <div className={`card discrepancy-analysis ${getStatusColor(experiment.status)}`}>
      <h2>🔍 Discrepancy Analysis</h2>

      <div className="status-badge">
        <span className={`badge ${getStatusColor(experiment.status)}`}>
          {getStatusLabel(experiment.status)}
        </span>
      </div>

      <div className="deviations">
        <h3>Property Deviations</h3>
        {experiment.deviations && Object.entries(experiment.deviations).map(([prop, dev]: any) => (
          <div key={prop} className={`deviation ${dev.percent_deviation > 0 ? 'positive' : 'negative'}`}>
            <div className="deviation-header">
              <span className="property-name">{prop.charAt(0).toUpperCase() + prop.slice(1)}</span>
              <span className="deviation-value">
                {dev.percent_deviation > 0 ? '+' : ''}{dev.percent_deviation.toFixed(1)}%
              </span>
            </div>
            <div className="deviation-details">
              <span>Predicted: {dev.predicted.toFixed(1)}% → Measured: {dev.measured.toFixed(1)}%</span>
            </div>
            <div className="deviation-bar">
              <div className="bar-background">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min(100, Math.abs(dev.percent_deviation))}%`,
                    backgroundColor: dev.percent_deviation > 0 ? '#2e7d32' : '#c62828',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hypothesis">
        <h3>🤔 System-Generated Hypothesis</h3>
        <p>{experiment.hypothesis}</p>
        {onReviewHypothesis && (
          <button className="btn-secondary" onClick={onReviewHypothesis}>
            Review & Propose Follow-up Experiment
          </button>
        )}
      </div>

      {experiment.notes && (
        <div className="researcher-notes">
          <h3>📌 Researcher Notes</h3>
          <p>{experiment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default DiscrepancyAnalysis;
