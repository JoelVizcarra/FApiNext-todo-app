from typing import Optional, List

from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi.params import Depends
from starlette import status

from settings import settings
from database import get_db
from models import UserModel
from schemas.user_schemas import UserSchema, UserCreateSchema
from utils.security import hash_password
from schemas.token_schemas import TokenDataSchema

SECRET_KEY = settings.get('SECRET_KEY')
ALGORITHM = settings.get('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = settings.get('ACCESS_TOKEN_EXPIRE_MINUTES')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_user_by_email(db: Session, email: str) -> Optional[UserModel]:
    return db.query(UserModel).filter(UserModel.email == email).first()


def get_all_users(db: Session) -> List[UserModel]:
    return db.query(UserModel).filter().all()


def add_user(db: Session, user_data: UserCreateSchema) -> UserSchema:
    hashed_password = hash_password(user_data.password)
    db_user = UserModel(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
    

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserModel:
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid JWT",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get('sub')
        if email is None:
            raise credential_exception
        token_data = TokenDataSchema(email=email)
    except JWTError:
        raise credential_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credential_exception
    return user