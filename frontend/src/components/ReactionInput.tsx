import React, { useState } from 'react';
import '../styles/components.css';

interface ReactionInputProps {
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export const ReactionInput: React.FC<ReactionInputProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: 'CO2 + H2 → Methanol',
    reactants: ['CO2', 'H2'],
    products: ['CH3OH'],
    temperature: 250,
    pressure: 50,
    solvent: 'water',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card reaction-input">
      <h2>🎯 Target Reaction Input</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Reaction Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., CO2 + H2 → Methanol"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reactants">Reactants (comma-separated)</label>
          <input
            id="reactants"
            type="text"
            value={formData.reactants.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                reactants: e.target.value.split(',').map((r) => r.trim()),
              })
            }
            placeholder="e.g., CO2, H2"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="products">Products (comma-separated)</label>
          <input
            id="products"
            type="text"
            value={formData.products.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                products: e.target.value.split(',').map((p) => p.trim()),
              })
            }
            placeholder="e.g., CH3OH"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="temp">Temperature (K)</label>
            <input
              id="temp"
              type="number"
              value={formData.temperature}
              onChange={(e) =>
                setFormData({ ...formData, temperature: Number(e.target.value) })
              }
              step="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pressure">Pressure (atm)</label>
            <input
              id="pressure"
              type="number"
              value={formData.pressure}
              onChange={(e) =>
                setFormData({ ...formData, pressure: Number(e.target.value) })
              }
              step="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="solvent">Solvent</label>
            <select
              id="solvent"
              value={formData.solvent}
              onChange={(e) => setFormData({ ...formData, solvent: e.target.value })}
            >
              <option value="water">Water</option>
              <option value="ethanol">Ethanol</option>
              <option value="acetone">Acetone</option>
              <option value="dme">DME</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '⏳ Processing...' : '🚀 Start Discovery Pipeline'}
        </button>
      </form>
    </div>
  );
};

export default ReactionInput;
