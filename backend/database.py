from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from settings import settings


engine = create_engine(settings.get('POSTGRESQL_URL'))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
