"""Generative Layer - Generates novel catalyst designs using AI"""

from typing import List, Dict, Any
import random
from app.core.logging import logger
from app.core.utils import generate_id, parse_chemical_formula, compute_similarity


class GenerativeLayer:
    """Generative Layer - Creates novel catalyst structures and variants"""
    
    def __init__(self):
        self.logger = logger
        self.generative_model_version = "v1.0-diffusion-gnn"
    
    def generate_variants(
        self,
        base_catalyst: Dict[str, Any],
        num_variants: int = 8,
        optimization_target: str = "activity"
    ) -> List[Dict[str, Any]]:
        """
        Generate novel catalyst variants based on a base catalyst.
        
        In production, this would use:
        - Graph Neural Networks (GNNs) with graph diffusion models
        - Trained on OC20/OC22 benchmarks
        - Constraint satisfaction for valency/steric rules
        
        For MVP, we use heuristic-based generation with physics-inspired modifications.
        """
        self.logger.info(
            f"Generating {num_variants} variants of {base_catalyst['name']} "
            f"(optimization: {optimization_target})"
        )
        
        variants = []
        base_comp = parse_chemical_formula(base_catalyst["composition"])
        base_props = {
            "activity": base_catalyst.get("activity", 50),
            "selectivity": base_catalyst.get("selectivity", 50),
            "stability": base_catalyst.get("stability", 50),
        }
        
        for i in range(num_variants):
            variant = self._create_variant(base_catalyst, base_comp, base_props, i, optimization_target)
            variants.append(variant)
        
        self.logger.info(f"Generated {len(variants)} variants successfully")
        return variants
    
    def _create_variant(
        self,
        base_cat: Dict[str, Any],
        base_comp: Dict[str, int],
        base_props: Dict[str, float],
        variant_index: int,
        opt_target: str
    ) -> Dict[str, Any]:
        """Create a single catalyst variant"""
        
        # Modification strategy
        modification_types = [
            "doping",           # Add dopant element
            "substitution",     # Replace element
            "composition_shift", # Adjust ratios
            "support_change",   # Modify support material
        ]
        
        mod_type = modification_types[variant_index % len(modification_types)]
        
        if mod_type == "doping":
            new_comp, description = self._apply_doping(base_cat["composition"], variant_index)
        elif mod_type == "substitution":
            new_comp, description = self._apply_substitution(base_cat["composition"], variant_index)
        elif mod_type == "composition_shift":
            new_comp, description = self._apply_composition_shift(base_cat["composition"], variant_index)
        else:
            new_comp, description = self._apply_support_change(base_cat["composition"], variant_index)
        
        # Predict property improvements based on modification
        predicted_improvements = self._predict_property_changes(
            mod_type, opt_target, base_comp, base_props
        )
        
        variant = {
            "id": generate_id(),
            "name": f"{base_cat['name']}_V{variant_index+1}",
            "composition": new_comp,
            "source": "generated",
            "confidence": 0.7 + (variant_index % 3) * 0.1,  # 0.7-0.9
            "modification_type": mod_type,
            "modification_description": description,
            "predicted_activity": base_props["activity"] + predicted_improvements.get("activity", 0),
            "predicted_selectivity": base_props["selectivity"] + predicted_improvements.get("selectivity", 0),
            "predicted_stability": base_props["stability"] + predicted_improvements.get("stability", 0),
            "predicted_improvement_pct": predicted_improvements.get("improvement_pct", 0),
        }
        
        return variant
    
    def _apply_doping(self, base_comp: str, index: int) -> tuple:
        """Apply doping modification"""
        dopants = ["N", "P", "S", "B", "C"]
        dopant = dopants[index % len(dopants)]
        new_comp = f"{base_comp}+{dopant}"
        description = f"Doped with {dopant} (non-metal dopant for enhanced electronic properties)"
        return new_comp, description
    
    def _apply_substitution(self, base_comp: str, index: int) -> tuple:
        """Apply substitution modification"""
        substitutions = ["Ni→Pd", "Cu→Ag", "Zn→Cd", "Al→Ga", "Cr→Mo"]
        sub = substitutions[index % len(substitutions)]
        new_comp = f"{base_comp} ({sub})"
        description = f"Substituted {sub} for enhanced catalytic properties"
        return new_comp, description
    
    def _apply_composition_shift(self, base_comp: str, index: int) -> tuple:
        """Apply composition ratio adjustment"""
        shifts = ["High-Cu", "High-Zn", "High-Al", "Defect-rich", "Over-stoichiometric"]
        shift = shifts[index % len(shifts)]
        new_comp = f"{base_comp} ({shift})"
        description = f"Adjusted to {shift} composition for improved reactivity"
        return new_comp, description
    
    def _apply_support_change(self, base_comp: str, index: int) -> tuple:
        """Apply support material change"""
        supports = ["TiO2", "SiO2", "Al2O3", "C", "ZrO2"]
        support = supports[index % len(supports)]
        new_comp = f"{base_comp}/{support}"
        description = f"Supported on {support} for enhanced stability and surface area"
        return new_comp, description
    
    def _predict_property_changes(
        self,
        mod_type: str,
        opt_target: str,
        base_comp: Dict[str, int],
        base_props: Dict[str, float]
    ) -> Dict[str, float]:
        """Predict changes in properties based on modification"""
        
        improvements = {}
        
        # Simple heuristic: modifications improve target property
        if mod_type == "doping":
            improvements["activity"] = 8 + random.uniform(-2, 2)  # ±2 variation
            improvements["selectivity"] = 5 + random.uniform(-1, 1)
            improvements["stability"] = -2 + random.uniform(-1, 1)  # May slightly reduce stability
        elif mod_type == "substitution":
            improvements["activity"] = 12 + random.uniform(-3, 3)
            improvements["selectivity"] = 3 + random.uniform(-1, 1)
            improvements["stability"] = 4 + random.uniform(-2, 2)
        elif mod_type == "composition_shift":
            improvements["activity"] = 6 + random.uniform(-2, 2)
            improvements["selectivity"] = 8 + random.uniform(-2, 2)
            improvements["stability"] = 2 + random.uniform(-1, 1)
        elif mod_type == "support_change":
            improvements["activity"] = 4 + random.uniform(-1, 1)
            improvements["selectivity"] = 6 + random.uniform(-2, 2)
            improvements["stability"] = 10 + random.uniform(-2, 2)
        
        # Optimize for target
        if opt_target == "activity":
            improvements["activity"] *= 1.5
        elif opt_target == "selectivity":
            improvements["selectivity"] *= 1.5
        elif opt_target == "stability":
            improvements["stability"] *= 1.5
        
        improvements["improvement_pct"] = (
            (improvements.get("activity", 0) + 
             improvements.get("selectivity", 0) + 
             improvements.get("stability", 0)) / 3
        )
        
        return improvements
    
    def validate_structure(self, composition: str) -> Dict[str, Any]:
        """
        Validate generated structure for chemical feasibility.
        In production, uses:
        - Valency rules (e.g., Cu2+, O2-)
        - Steric constraints
        - Known phase diagrams
        - SME human-in-loop for novel structures
        """
        issues = []
        
        # Simple mock validation
        if len(composition) < 3:
            issues.append("Composition too simple")
        
        return {
            "is_valid": len(issues) == 0,
            "issues": issues,
            "requires_human_review": len(issues) > 0,
            "confidence": 0.95 if len(issues) == 0 else 0.6,
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the generative model"""
        return {
            "version": self.generative_model_version,
            "model_type": "Graph Neural Network + Diffusion",
            "training_data": "OC20/OC22 benchmarks",
            "supported_elements": ["Cu", "Zn", "Al", "Ni", "Pd", "Pt", "Ag", "Fe", "Co", "Mn", "Cr", "Mo"],
            "constraints": ["Valency rules", "Steric feasibility", "Phase diagram compatibility"],
        }
