import React, { useState } from 'react';
import '../styles/components.css';

interface ExperimentLogProps {
  catalystId: string;
  catalystName: string;
  predictedProperties: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export const ExperimentLog: React.FC<ExperimentLogProps> = ({
  catalystId,
  catalystName,
  predictedProperties,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    measured_activity: '',
    measured_selectivity: '',
    measured_stability: '',
    yield_percentage: '',
    researcher_name: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      catalyst_id: catalystId,
      measured_properties: {
        activity: parseFloat(formData.measured_activity),
        selectivity: parseFloat(formData.measured_selectivity),
        stability: parseFloat(formData.measured_stability),
      },
      predicted_properties: predictedProperties,
      yield_percentage: parseFloat(formData.yield_percentage) || null,
      researcher_name: formData.researcher_name,
      notes: formData.notes,
    });
  };

  return (
    <div className="card experiment-log">
      <h2>📝 Log Experimental Results</h2>
      <p className="subtitle">Catalyst: {catalystName}</p>

      <div className="prediction-summary">
        <h3>Predicted Properties</h3>
        <div className="properties">
          <div className="property">
            <span>Activity</span>
            <strong>{predictedProperties.activity?.toFixed(1)}%</strong>
          </div>
          <div className="property">
            <span>Selectivity</span>
            <strong>{predictedProperties.selectivity?.toFixed(1)}%</strong>
          </div>
          <div className="property">
            <span>Stability</span>
            <strong>{predictedProperties.stability?.toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Measured Properties</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="activity">Measured Activity (%)</label>
            <input
              id="activity"
              type="number"
              value={formData.measured_activity}
              onChange={(e) =>
                setFormData({ ...formData, measured_activity: e.target.value })
              }
              placeholder="0-100"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="selectivity">Measured Selectivity (%)</label>
            <input
              id="selectivity"
              type="number"
              value={formData.measured_selectivity}
              onChange={(e) =>
                setFormData({ ...formData, measured_selectivity: e.target.value })
              }
              placeholder="0-100"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stability">Measured Stability (%)</label>
            <input
              id="stability"
              type="number"
              value={formData.measured_stability}
              onChange={(e) =>
                setFormData({ ...formData, measured_stability: e.target.value })
              }
              placeholder="0-100"
              step="0.1"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="yield">Yield (%)</label>
          <input
            id="yield"
            type="number"
            value={formData.yield_percentage}
            onChange={(e) =>
              setFormData({ ...formData, yield_percentage: e.target.value })
            }
            placeholder="0-100"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="researcher">Researcher Name</label>
          <input
            id="researcher"
            type="text"
            value={formData.researcher_name}
            onChange={(e) =>
              setFormData({ ...formData, researcher_name: e.target.value })
            }
            placeholder="Your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Observations & Notes</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any observations, issues, or additional details..."
            rows={4}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '⏳ Submitting...' : '✅ Submit Results'}
        </button>
      </form>
    </div>
  );
};

export default ExperimentLog;
