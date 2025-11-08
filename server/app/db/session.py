import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .base import Base


# Read database URL from environment; fall back to a local sqlite file for dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./grantly_dev.db")


# create_engine kwargs
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
	# needed for sqlite to allow multithreaded access in some dev setups
	connect_args = {"check_same_thread": False}


engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
	"""Yield a database session for use with FastAPI dependencies or manual usage.

	Usage (FastAPI):
		def endpoint(db: Session = Depends(get_db)):
			...
	"""
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


def init_db():
	"""Create all tables for models that import `Base`.

	Note: this will only create tables for models registered on `Base` via
	SQLAlchemy declarative model definitions. For production use, prefer
	a migration system (Alembic).
	"""
	Base.metadata.create_all(bind=engine)


__all__ = ["engine", "SessionLocal", "get_db", "init_db", "DATABASE_URL"]


# Ensure models are imported so SQLAlchemy's declarative base has them registered
try:
	# import side-effect: registers models with Base.metadata
	from . import models  # noqa: F401
except Exception:
	# if models can't be imported (missing deps) we avoid crashing on import time
	models = None
