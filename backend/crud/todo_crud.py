from typing import List, Optional
from fastapi import HTTPException

from sqlalchemy.orm import Session

from models import TodoModel, UserModel
from schemas.todo_schemas import TodoSchema, TodoBaseSchema


def add_todo(
        db: Session,
        current_user: UserModel,
        todo_data: TodoSchema,
):
    todo: TodoModel = TodoModel(
        text=todo_data.text,
        completed=todo_data.completed,
    )
    todo.owner = current_user
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo

# TODO move object permission from CRUD
def update_todo(
        db: Session,
        todo_id: int,
        new_todo: TodoBaseSchema,
        current_user_id: int,
):
    todo: TodoModel = db.query(TodoModel).filter(
        TodoModel.id == todo_id,
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Not Found")

    if todo.owner_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update todo")
    todo.text = new_todo.text
    todo.completed = new_todo.completed
    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(
        db: Session,
        todo_id: int,
        current_user_id: int,
):
    todo: TodoModel = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Not Found")
    if todo.owner_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete todo")
    db.delete(todo)
    db.commit()


def get_user_todos(
        db: Session,
        current_user: UserModel,
) -> List[TodoModel]:
    todos = db.query(TodoModel).filter(TodoModel.owner == current_user).order_by(TodoModel.id).all()
    return todos


def get_todo_by_id(db: Session, id: int) -> Optional[TodoModel]:
    return db.query(TodoModel).filter(TodoModel.id == id).first()