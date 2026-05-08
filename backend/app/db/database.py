"""Database engine and session configuration."""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.logging import logger

# Import Base from models so create_all sees every table
from app.models.models import Base  # noqa: F401


def _build_engine():
    """Create the SQLAlchemy engine with settings appropriate for the DB backend."""
    url = settings.database_url

    # Render provides postgres:// but SQLAlchemy 2.x needs postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    is_sqlite = "sqlite" in url

    connect_args = {"check_same_thread": False} if is_sqlite else {}

    # For PostgreSQL on Render: use connection pooling
    pool_kwargs = {}
    if not is_sqlite:
        pool_kwargs = {
            "pool_size": 5,
            "max_overflow": 10,
            "pool_timeout": 30,
            "pool_recycle": 1800,  # Recycle connections every 30 min
        }

    engine = create_engine(
        url,
        connect_args=connect_args,
        echo=settings.debug,
        pool_pre_ping=True,
        **pool_kwargs,
    )

    # Enable WAL mode and foreign keys for SQLite
    if is_sqlite:
        @event.listens_for(engine, "connect")
        def _set_sqlite_pragma(dbapi_conn, connection_record):
            cursor = dbapi_conn.cursor()
            cursor.execute("PRAGMA journal_mode=WAL")
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    return engine


engine = _build_engine()

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """FastAPI dependency – yields a scoped DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables from ORM metadata (idempotent)."""
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully")
