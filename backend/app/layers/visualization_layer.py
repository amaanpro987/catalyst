"""Visualization Layer - Formats data for interactive visualization"""

from typing import List, Dict, Any
from app.core.logging import logger


class VisualizationLayer:
    """Visualization Layer - Prepares data for interactive dashboards and viewers"""
    
    def __init__(self):
        self.logger = logger
    
    def format_catalyst_for_viewer(self, catalyst: Dict[str, Any], prediction: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Format catalyst data for 3D molecular viewer (Plotly, 3Dmol.js).
        
        In production:
        - Generates 3D coordinates from SMILES or structure files
        - Prepares atomic positions for rendering
        - Includes adsorption site information
        - Supports multiple visualization formats
        """
        self.logger.info(f"Formatting catalyst {catalyst['name']} for visualization")
        
        formatted = {
            "id": catalyst["id"],
            "name": catalyst["name"],
            "composition": catalyst["composition"],
            "source": catalyst["source"],
            "description": catalyst.get("description", ""),
            
            # Mock 3D structure (in production, from structure files)
            "structure_3d": {
                "format": "xyz",  # Could be: xyz, pdb, cif, or SMILES
                "atoms": self._generate_mock_structure(catalyst["composition"]),
                "lattice": {"a": 4.5, "b": 4.5, "c": 4.5, "angles": [90, 90, 90]},
            },
            
            # Mock 2D representation
            "structure_2d": {
                "format": "SMILES",
                "smiles": f"[{catalyst['composition']}]",  # Placeholder
                "svg_url": f"/api/visualization/smiles/{catalyst['id']}",
            },
            
            # Predicted properties for visualization
            "properties": {
                "activity": prediction["activity"] if prediction else catalyst.get("activity", 50),
                "selectivity": prediction["selectivity"] if prediction else catalyst.get("selectivity", 50),
                "stability": prediction["stability"] if prediction else catalyst.get("stability", 50),
                "uncertainty": prediction["uncertainty"] if prediction else 0.2,
            },
            
            # Visualization hints
            "visualization_hints": {
                "highlight_sites": self._identify_active_sites(catalyst["composition"]),
                "color_scheme": "CPK",  # Corey-Pauling-Koltun coloring
                "surface_type": "van_der_waals",
            },
        }
        
        return formatted
    
    def create_performance_plot_data(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Create data for performance comparison plot.
        Returns Plotly-compatible structure for 2D scatter plots.
        """
        self.logger.info(f"Creating performance plot for {len(predictions)} catalysts")
        
        # Extract data
        names = [p["catalyst_name"] for p in predictions]
        activities = [p["activity"] for p in predictions]
        selectivities = [p["selectivity"] for p in predictions]
        stabilities = [p["stability"] for p in predictions]
        ranks = [p.get("rank", 0) for p in predictions]
        uncertainties = [p["uncertainty"] for p in predictions]
        
        # Create Plotly scatter plot structure
        plot_data = {
            "type": "scatter",
            "mode": "markers",
            "x": activities,
            "y": selectivities,
            "marker": {
                "size": [10] * len(activities),
                "color": stabilities,  # Color by stability
                "colorscale": "Greys",
                "showscale": True,
                "colorbar": {
                    "title": "Stability (%)",
                },
                "line": {
                    "width": 2,
                    "color": "black",
                },
            },
            "text": [f"{name}<br>Rank: {rank}<br>Uncertainty: ±{unc:.1%}" 
                     for name, rank, unc in zip(names, ranks, uncertainties)],
            "hovertemplate": "%{text}<extra></extra>",
            "name": "Catalysts",
        }
        
        layout = {
            "title": "Catalyst Performance (Activity vs Selectivity, colored by Stability)",
            "xaxis": {"title": "Predicted Activity (%)"},
            "yaxis": {"title": "Predicted Selectivity (%)"},
            "plot_bgcolor": "white",
            "paper_bgcolor": "white",
            "font": {"color": "black", "family": "Arial"},
            "width": 1000,
            "height": 600,
        }
        
        return {
            "data": [plot_data],
            "layout": layout,
        }
    
    def create_ranking_table_data(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create tabular data for ranking display"""
        return {
            "columns": [
                {"key": "rank", "label": "Rank", "width": "80px"},
                {"key": "catalyst_name", "label": "Catalyst", "width": "200px"},
                {"key": "composition", "label": "Composition", "width": "200px"},
                {"key": "source", "label": "Source", "width": "120px"},
                {"key": "activity", "label": "Activity (%)", "width": "120px", "sortable": True},
                {"key": "selectivity", "label": "Selectivity (%)", "width": "120px", "sortable": True},
                {"key": "stability", "label": "Stability (%)", "width": "120px", "sortable": True},
                {"key": "combined_score", "label": "Score", "width": "100px", "sortable": True},
                {"key": "uncertainty", "label": "Uncertainty", "width": "120px"},
            ],
            "rows": [
                {
                    "rank": p.get("rank", i+1),
                    "catalyst_name": p["catalyst_name"],
                    "composition": p["composition"],
                    "source": p["source"],
                    "activity": f"{p['activity']:.1f}%",
                    "selectivity": f"{p['selectivity']:.1f}%",
                    "stability": f"{p['stability']:.1f}%",
                    "combined_score": f"{p.get('combined_score', 0):.1f}",
                    "uncertainty": f"±{p['uncertainty']:.1%}",
                }
                for i, p in enumerate(predictions)
            ],
        }
    
    def create_reaction_energy_diagram(self, catalyst_id: str) -> Dict[str, Any]:
        """
        Create reaction energy profile diagram.
        Shows: Reactants → Intermediates → Products
        """
        # Mock energy profile
        energy_profile = {
            "title": f"Reaction Energy Profile",
            "x_label": "Reaction Coordinate",
            "y_label": "Energy (eV)",
            "data": [
                {"name": "Reactants", "energy": 0.0, "position": 0},
                {"name": "Intermediate 1", "energy": 0.5, "position": 1},
                {"name": "Intermediate 2", "energy": 0.3, "position": 2},
                {"name": "Activation Barrier", "energy": 1.2, "position": 1.5},
                {"name": "Products", "energy": -0.8, "position": 3},
            ],
        }
        
        return energy_profile
    
    def _generate_mock_structure(self, composition: str) -> List[Dict[str, Any]]:
        """Generate mock 3D atomic structure"""
        # Simple mock: create atoms at lattice positions
        atoms = []
        positions = [
            (0.0, 0.0, 0.0),
            (0.5, 0.5, 0.0),
            (0.5, 0.0, 0.5),
            (0.0, 0.5, 0.5),
        ]
        
        for i, pos in enumerate(positions):
            atoms.append({
                "symbol": composition.split("0")[i % len(composition.split("0"))],
                "x": pos[0] * 4.5,
                "y": pos[1] * 4.5,
                "z": pos[2] * 4.5,
                "index": i,
            })
        
        return atoms
    
    def _identify_active_sites(self, composition: str) -> List[Dict[str, Any]]:
        """Identify and mark potential active sites"""
        # Mock: identify transition metal sites as active
        sites = [
            {
                "position": [2.25, 2.25, 2.25],
                "type": "bridge_site",
                "coordination": 6,
                "reactivity": "high",
            }
        ]
        return sites
    
    def get_dashboard_summary(self, reaction_id: str, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Get summary statistics for dashboard"""
        if not predictions:
            return {}
        
        avg_activity = sum(p["activity"] for p in predictions) / len(predictions)
        avg_selectivity = sum(p["selectivity"] for p in predictions) / len(predictions)
        avg_stability = sum(p["stability"] for p in predictions) / len(predictions)
        avg_uncertainty = sum(p["uncertainty"] for p in predictions) / len(predictions)
        
        top_5 = sorted(predictions, key=lambda x: x.get("combined_score", 0), reverse=True)[:5]
        
        return {
            "reaction_id": reaction_id,
            "total_candidates": len(predictions),
            "known_catalysts": len([p for p in predictions if "known" in p.get("source", "")]),
            "generated_catalysts": len([p for p in predictions if "generated" in p.get("source", "")]),
            "average_metrics": {
                "activity": f"{avg_activity:.1f}%",
                "selectivity": f"{avg_selectivity:.1f}%",
                "stability": f"{avg_stability:.1f}%",
                "uncertainty": f"±{avg_uncertainty:.1%}",
            },
            "top_5_recommendations": [
                {
                    "rank": t.get("rank", i+1),
                    "name": t["catalyst_name"],
                    "score": f"{t.get('combined_score', 0):.1f}",
                }
                for i, t in enumerate(top_5)
            ],
        }
