import os
import pytest
from fastapi.testclient import TestClient

# Ensure the project root is in PYTHONPATH for imports
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in os.sys.path:
    os.sys.path.append(PROJECT_ROOT)

from app.main import app
from app.db.database import get_db
from app.models.models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Create an in‑memory SQLite engine for tests
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency to use the test session
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="session")
def client():
    # Create all tables in the test database
    Base.metadata.create_all(bind=engine)
    # Apply the dependency override
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Drop all tables after the test session
    Base.metadata.drop_all(bind=engine)
    # Cleanup after tests
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()
