import logging
import sys
from app.core.config import settings


def get_logger(name: str) -> logging.Logger:
    """Create and return a configured logger"""
    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG if settings.debug else logging.INFO)

    return logger


logger = get_logger(__name__)
