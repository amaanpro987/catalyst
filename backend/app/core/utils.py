"""Utility functions for the catalyst discovery platform"""

import uuid
from datetime import datetime
from typing import List, Dict, Any

def generate_id() -> str:
    """Generate a unique ID"""
    return f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:8]}"

def calculate_activity_score(base_value: float, modifiers: List[float]) -> float:
    """
    Calculate activity score based on base value and modifiers
    Used by prediction layer
    """
    score = base_value
    for modifier in modifiers:
        score *= (1 + modifier)
    return max(0, min(100, score))  # Clamp between 0-100

def parse_chemical_formula(formula: str) -> Dict[str, int]:
    """
    Simple parser for chemical formulas
    Example: "Cu2Zn1Al1" -> {"Cu": 2, "Zn": 1, "Al": 1}
    """
    result = {}
    i = 0
    while i < len(formula):
        if formula[i].isupper():
            element = formula[i]
            i += 1
            num_str = ""
            while i < len(formula) and formula[i].isdigit():
                num_str += formula[i]
                i += 1
            result[element] = int(num_str) if num_str else 1
        else:
            i += 1
    return result

def compute_similarity(composition1: Dict[str, int], composition2: Dict[str, int]) -> float:
    """
    Compute similarity between two catalyst compositions
    Returns value between 0 and 1
    """
    all_elements = set(composition1.keys()) | set(composition2.keys())
    if not all_elements:
        return 1.0
    
    differences = 0
    for element in all_elements:
        diff = abs(composition1.get(element, 0) - composition2.get(element, 0))
        differences += diff
    
    max_difference = max(sum(composition1.values()), sum(composition2.values())) or 1
    similarity = 1 - (differences / max_difference)
    return max(0, min(1, similarity))
