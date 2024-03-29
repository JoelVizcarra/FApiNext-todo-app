from datetime import timedelta

from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette.status import HTTP_401_UNAUTHORIZED

from settings import settings
from crud import user_crud
from database import get_db
from schemas.token_schemas import TokenSchema
from schemas.user_schemas import UserSchema, UserCreateSchema
from utils.security import authenticate_user, create_access_token

ACCESS_TOKEN_EXPIRE_MINUTES = settings.get('ACCESS_TOKEN_EXPIRE_MINUTES')

auth_router = APIRouter()

@auth_router.post("/signup", response_model=UserSchema)
def signup(user_data: UserCreateSchema, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db, user_data.email)
    if user:
        raise HTTPException(
            status_code=409,
            detail="Email already exist",
        )
    new_user = user_crud.add_user(db, user_data)
    return new_user


@auth_router.post("/login", response_model=TokenSchema)
def login(
        db: Session = Depends(get_db),
        form_data: OAuth2PasswordRequestForm = Depends()
):
    user_data = authenticate_user(db, form_data.username, form_data.password)
    if not user_data:
        raise HTTPException(
            HTTP_401_UNAUTHORIZED,
            detail="invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_expires_date = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': user_data.email},
        expires_delta=token_expires_date,
    )
    return {'access_token': access_token, 'token_type': 'bearer'}

