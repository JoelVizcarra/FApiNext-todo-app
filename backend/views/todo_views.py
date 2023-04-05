from typing import List

from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.orm import Session
from starlette.status import HTTP_204_NO_CONTENT

import crud.todo_crud as todo_crud
from crud.user_crud import get_current_user
from database import get_db
from models import UserModel
from schemas.todo_schemas import TodoBaseSchema, TodoResponseSchema

todo_router = APIRouter()


@todo_router.get('', response_model=List[TodoResponseSchema])
def get_my_todos_view(db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    todos = todo_crud.get_user_todos(db, current_user)
    return todos


@todo_router.post('', response_model=TodoResponseSchema)
def add_todo_view(
        todo_data: TodoBaseSchema,
        db: Session = Depends(get_db),
        current_user: UserModel = Depends(get_current_user),
):
    todo = todo_crud.add_todo(
        db,
        current_user,
        todo_data,
    )
    return todo


@todo_router.put('/{todo_id:int}', response_model=TodoResponseSchema)
def update_todo_view(
        todo_id: int,
        todo_data: TodoBaseSchema,
        db: Session = Depends(get_db),
        current_user: UserModel = Depends(get_current_user),
):
    todo = todo_crud.update_todo(db, todo_id, todo_data, current_user.id)
    return todo


@todo_router.delete('/{todo_id:int}', status_code=HTTP_204_NO_CONTENT)
def delete_todo_view(
        todo_id: int,
        db: Session = Depends(get_db),
        current_user: UserModel = Depends(get_current_user)
):
    todo_crud.delete_todo(db, todo_id, current_user.id)
    return 
