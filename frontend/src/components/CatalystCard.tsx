import React from 'react';
import '../styles/components.css';

interface CatalystCardProps {
  catalyst: any;
  rank?: number;
  onSelect?: (catalyst: any) => void;
  showActions?: boolean;
}

export const CatalystCard: React.FC<CatalystCardProps> = ({
  catalyst,
  rank,
  onSelect,
  showActions = true,
}) => {
  return (
    <div className="catalyst-card">
      {rank && <div className="rank-badge">#{rank}</div>}
      <h3>{catalyst.name}</h3>
      <p className="composition">{catalyst.composition}</p>
      <p className="source">{catalyst.source}</p>

      <div className="properties">
        <div className="property">
          <span>Activity</span>
          <strong>{catalyst.activity?.toFixed(1)}%</strong>
        </div>
        <div className="property">
          <span>Selectivity</span>
          <strong>{catalyst.selectivity?.toFixed(1)}%</strong>
        </div>
        <div className="property">
          <span>Stability</span>
          <strong>{catalyst.stability?.toFixed(1)}%</strong>
        </div>
      </div>

      {catalyst.uncertainty && (
        <div className="uncertainty">Uncertainty: ±{(catalyst.uncertainty * 100).toFixed(1)}%</div>
      )}

      {catalyst.combined_score && (
        <div className="score">Score: {catalyst.combined_score.toFixed(2)}</div>
      )}

      {showActions && onSelect && (
        <button className="btn-secondary" onClick={() => onSelect(catalyst)}>
          View Details
        </button>
      )}
    </div>
  );
};

interface CatalystListProps {
  catalysts: any[];
  title: string;
  onSelect?: (catalyst: any) => void;
}

export const CatalystList: React.FC<CatalystListProps> = ({
  catalysts,
  title,
  onSelect,
}) => {
  return (
    <div className="card catalyst-list">
      <h2>{title}</h2>
      <p className="count">Total: {catalysts.length} catalysts</p>
      <div className="grid">
        {catalysts.map((catalyst, index) => (
          <CatalystCard
            key={catalyst.id}
            catalyst={catalyst}
            rank={index + 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalystCard;
