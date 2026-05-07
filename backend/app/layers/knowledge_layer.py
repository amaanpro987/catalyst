"""Knowledge Layer - Retrieves known catalysts from scientific databases"""

from typing import List, Dict, Any
from app.core.logging import logger
from app.core.utils import generate_id, parse_chemical_formula


# Mock data for known catalysts from scientific databases
# In production, these would be retrieved from APIs (Materials Project, Open Catalyst Project, etc.)
KNOWN_CATALYSTS_DB = [
    {
        "id": "cat_001",
        "name": "Cu-Zn-Al Oxide",
        "composition": "Cu0.6Zn0.2Al0.2",
        "source": "Open Catalyst Project",
        "activity": 72.5,
        "selectivity": 88.0,
        "stability": 85.0,
        "description": "Industrial standard Cu-Zn-Al oxide catalyst for CO2 hydrogenation",
        "structure": {"lattice": "cubic", "dopants": ["Al"]},
    },
    {
        "id": "cat_002",
        "name": "Cu-Zn-Cr Oxide",
        "composition": "Cu0.5Zn0.3Cr0.2",
        "source": "Open Catalyst Project",
        "activity": 68.0,
        "selectivity": 82.0,
        "stability": 80.0,
        "description": "Cu-Zn-Cr oxide with chromium promoter",
        "structure": {"lattice": "cubic", "dopants": ["Cr"]},
    },
    {
        "id": "cat_003",
        "name": "Pt/C Catalyst",
        "composition": "Pt0.05C0.95",
        "source": "Materials Project",
        "activity": 85.0,
        "selectivity": 78.0,
        "stability": 70.0,
        "description": "Platinum on carbon support",
        "structure": {"support": "carbon", "nanoparticles": "Pt"},
    },
    {
        "id": "cat_004",
        "name": "Pd/Al2O3",
        "composition": "Pd0.02Al0.98O3",
        "source": "Materials Project",
        "activity": 75.0,
        "selectivity": 84.0,
        "stability": 82.0,
        "description": "Palladium on alumina support",
        "structure": {"support": "Al2O3", "nanoparticles": "Pd"},
    },
    {
        "id": "cat_005",
        "name": "Ni-Mo-S",
        "composition": "Ni0.4Mo0.4S0.2",
        "source": "BRENDA",
        "activity": 62.0,
        "selectivity": 86.0,
        "stability": 88.0,
        "description": "Nickel-molybdenum sulfide HER catalyst",
        "structure": {"lattice": "layered", "edges": "MoS2-edge"},
    },
    {
        "id": "cat_006",
        "name": "Fe-Ni/N-C",
        "composition": "Fe0.3Ni0.3N0.1C0.3",
        "source": "Open Catalyst Project",
        "activity": 70.0,
        "selectivity": 80.0,
        "stability": 75.0,
        "description": "Fe-Ni doped nitrogen-carbon ORR catalyst",
        "structure": {"dopant": "N", "support": "carbon"},
    },
    {
        "id": "cat_007",
        "name": "Co3O4",
        "composition": "Co0.75O",
        "source": "Materials Project",
        "activity": 65.0,
        "selectivity": 79.0,
        "stability": 84.0,
        "description": "Cobalt oxide OER catalyst",
        "structure": {"lattice": "spinel"},
    },
    {
        "id": "cat_008",
        "name": "MnO2/C",
        "composition": "Mn0.1O0.2C0.7",
        "source": "BRENDA",
        "activity": 58.0,
        "selectivity": 75.0,
        "stability": 80.0,
        "description": "Manganese dioxide on carbon",
        "structure": {"support": "carbon", "particles": "MnO2"},
    },
    {
        "id": "cat_009",
        "name": "Ag-Cu Alloy",
        "composition": "Ag0.4Cu0.6",
        "source": "Materials Project",
        "activity": 76.0,
        "selectivity": 87.0,
        "stability": 83.0,
        "description": "Silver-copper bimetallic catalyst",
        "structure": {"alloy": "AgCu", "structure": "FCC"},
    },
    {
        "id": "cat_010",
        "name": "RuO2/TiO2",
        "composition": "Ru0.05O0.2Ti0.75O2",
        "source": "Open Catalyst Project",
        "activity": 82.0,
        "selectivity": 81.0,
        "stability": 77.0,
        "description": "Ruthenium oxide on titanium dioxide",
        "structure": {"support": "TiO2", "particles": "RuO2"},
    },
]

# More catalysts for comprehensive database
KNOWN_CATALYSTS_DB.extend([
    {
        "id": f"cat_{str(i+11).zfill(3)}",
        "name": f"Catalyst_{i+11}",
        "composition": f"Element{i%5}0.{50+i%40}Element{(i+1)%5}0.{30-(i%30)}",
        "source": ["Materials Project", "Open Catalyst Project", "BRENDA"][i % 3],
        "activity": 50 + (i % 40),
        "selectivity": 70 + (i % 25),
        "stability": 60 + (i % 35),
        "description": f"Synthetic catalyst variant {i+11}",
        "structure": {"variant": i},
    }
    for i in range(1, 14)  # Creates 13 more catalysts for total of 23+
])


class KnowledgeLayer:
    """Knowledge Layer - Handles scientific database retrieval"""
    
    def __init__(self):
        self.logger = logger
        self.catalysts_db = KNOWN_CATALYSTS_DB
    
    def retrieve_catalysts_for_reaction(
        self, 
        reactants: List[str], 
        products: List[str],
        limit: int = 23
    ) -> List[Dict[str, Any]]:
        """
        Retrieve known catalysts from scientific databases for a given reaction.
        
        In production, this would:
        - Query Materials Project API
        - Query Open Catalyst Project
        - Query BRENDA for enzyme catalysts
        - Query internal experiment database
        - Perform semantic matching on reactants/products
        
        For MVP, we return curated mock data.
        """
        self.logger.info(
            f"Retrieving known catalysts for reaction: {reactants} → {products}"
        )
        
        # Simulate filtering by reaction type (in real implementation, use semantic similarity)
        retrieved = sorted(
            self.catalysts_db,
            key=lambda x: (x.get("activity", 0) + x.get("selectivity", 0)) / 2,
            reverse=True
        )
        
        return retrieved[:limit]
    
    def get_catalyst_details(self, catalyst_id: str) -> Dict[str, Any]:
        """Retrieve detailed information for a specific catalyst"""
        for cat in self.catalysts_db:
            if cat["id"] == catalyst_id:
                self.logger.info(f"Retrieved details for catalyst: {catalyst_id}")
                return cat
        self.logger.warning(f"Catalyst not found: {catalyst_id}")
        return None
    
    def search_catalysts_by_composition(self, element: str) -> List[Dict[str, Any]]:
        """Search for catalysts containing a specific element"""
        matching = [
            cat for cat in self.catalysts_db 
            if element.lower() in cat["composition"].lower()
        ]
        self.logger.info(f"Found {len(matching)} catalysts containing {element}")
        return matching
    
    def add_catalyst_to_knowledge_base(
        self, 
        name: str, 
        composition: str, 
        properties: Dict[str, float],
        source: str = "experimental"
    ) -> Dict[str, Any]:
        """
        Add a newly discovered catalyst to the knowledge base.
        This is called from the Feedback Layer after experimental validation.
        """
        catalyst = {
            "id": generate_id(),
            "name": name,
            "composition": composition,
            "source": source,
            "activity": properties.get("activity", 0),
            "selectivity": properties.get("selectivity", 0),
            "stability": properties.get("stability", 0),
            "description": f"Experimentally validated {name}",
            "structure": properties.get("structure", {}),
        }
        self.catalysts_db.append(catalyst)
        self.logger.info(f"Added new catalyst to knowledge base: {catalyst['id']}")
        return catalyst
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        if not self.catalysts_db:
            return {}
        
        activities = [c.get("activity", 0) for c in self.catalysts_db]
        selectivities = [c.get("selectivity", 0) for c in self.catalysts_db]
        stabilities = [c.get("stability", 0) for c in self.catalysts_db]
        
        return {
            "total_catalysts": len(self.catalysts_db),
            "avg_activity": sum(activities) / len(activities) if activities else 0,
            "avg_selectivity": sum(selectivities) / len(selectivities) if selectivities else 0,
            "avg_stability": sum(stabilities) / len(stabilities) if stabilities else 0,
            "sources": list(set(c.get("source", "unknown") for c in self.catalysts_db)),
        }
