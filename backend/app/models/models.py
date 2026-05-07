"""SQLAlchemy ORM models for the platform"""

from sqlalchemy import Column, String, Float, Integer, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base
from app.core.utils import generate_id


class Reaction(Base):
    """Target reaction model"""
    __tablename__ = "reactions"
    
    id = Column(String, primary_key=True, default=generate_id)
    name = Column(String(255), nullable=False)
    reactants = Column(JSON, nullable=False)  # List of reactant names
    products = Column(JSON, nullable=False)   # List of product names
    temperature = Column(Float, default=298.15)  # Kelvin
    pressure = Column(Float, default=1.0)  # atm
    solvent = Column(String(255), default="water")
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    catalysts = relationship("Catalyst", back_populates="reaction")
    predictions = relationship("Prediction", back_populates="reaction")
    experiments = relationship("Experiment", back_populates="reaction")


class Catalyst(Base):
    """Catalyst model (both known and generated)"""
    __tablename__ = "catalysts"
    
    id = Column(String, primary_key=True, default=generate_id)
    reaction_id = Column(String, ForeignKey("reactions.id"), nullable=False)
    name = Column(String(255), nullable=False)
    composition = Column(String(255), nullable=False)  # e.g., "Cu2Zn1Al1"
    structure_data = Column(JSON)  # 3D structure or SMILES
    source = Column(String(50), default="known")  # "known" or "generated"
    confidence = Column(Float, default=0.5)  # 0-1 for generated catalysts
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reaction = relationship("Reaction", back_populates="catalysts")
    predictions = relationship("Prediction", back_populates="catalyst")
    experiments = relationship("Experiment", back_populates="catalyst")


class Prediction(Base):
    """ML model predictions for catalysts"""
    __tablename__ = "predictions"
    
    id = Column(String, primary_key=True, default=generate_id)
    reaction_id = Column(String, ForeignKey("reactions.id"), nullable=False)
    catalyst_id = Column(String, ForeignKey("catalysts.id"), nullable=False)
    
    # Predicted properties
    activity = Column(Float)  # 0-100
    selectivity = Column(Float)  # 0-100
    stability = Column(Float)  # 0-100
    turnover_frequency = Column(Float)  # mol/s/mol_cat
    uncertainty = Column(Float, default=0.1)  # 0-1
    
    model_version = Column(String(50), default="v1.0")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reaction = relationship("Reaction", back_populates="predictions")
    catalyst = relationship("Catalyst", back_populates="predictions")


class Experiment(Base):
    """Logged experimental results for feedback loop"""
    __tablename__ = "experiments"
    
    id = Column(String, primary_key=True, default=generate_id)
    reaction_id = Column(String, ForeignKey("reactions.id"), nullable=False)
    catalyst_id = Column(String, ForeignKey("catalysts.id"), nullable=False)
    
    # Measured properties
    measured_activity = Column(Float)
    measured_selectivity = Column(Float)
    measured_stability = Column(Float)
    yield_percentage = Column(Float)
    
    # Analysis
    notes = Column(Text)
    hypothesis = Column(Text)  # System-generated hypothesis
    status = Column(String(50), default="pending")  # pending, verified, anomaly
    
    researcher_name = Column(String(255))
    tested_at = Column(DateTime)
    logged_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    reaction = relationship("Reaction", back_populates="experiments")
    catalyst = relationship("Catalyst", back_populates="experiments")
    
    # Discrepancy tracking
    activity_deviation = Column(Float)  # Measured - Predicted
    selectivity_deviation = Column(Float)
    stability_deviation = Column(Float)


class ModelVersion(Base):
    """Track ML model versions and retraining history"""
    __tablename__ = "model_versions"
    
    id = Column(String, primary_key=True, default=generate_id)
    version = Column(String(50), unique=True)
    model_type = Column(String(100))  # "prediction", "generative", etc.
    accuracy_score = Column(Float)
    training_samples = Column(Integer)
    training_completed_at = Column(DateTime)
    status = Column(String(50), default="active")  # active, archived, testing
    notes = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
