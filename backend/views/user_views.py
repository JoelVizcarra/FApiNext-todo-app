from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session
from starlette import status

from settings import settings
from crud import user_crud
from crud.user_crud import get_current_user
from database import get_db
from models import UserModel
from schemas.user_schemas import UserSchema

ACCESS_TOKEN_EXPIRE_MINUTES = settings.get('ACCESS_TOKEN_EXPIRE_MINUTES')

user_router = APIRouter()

@user_router.get("", response_model=List[UserSchema])
def users(db: Session = Depends(get_db)):
    users = user_crud.get_all_users(db)
    return list(users)


@user_router.get("/me", response_model=UserSchema)
def get_me(user_data: UserModel = Depends(get_current_user)) -> UserSchema:
    return user_data
    
@user_router.get("/{email:str}", response_model=UserSchema)
def get_user(email: str, db: Session = Depends(get_db)) -> UserSchema:
    user = user_crud.get_user_by_email(db, email)
    if user:
        return user
    else:
        raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User doesn't exits",
            )

