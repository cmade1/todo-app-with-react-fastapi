from fastapi import FastAPI , Depends , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal , engine
from models import Todo , Base
from pydantic import BaseModel 
import models
from typing import List
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)
  
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class TodoCreate(BaseModel):
    title: str

class TodoMove(BaseModel):
    direction: str

class Todo(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/todos")
def get_todos(db=Depends(get_db)):
    todos= db.query(models.Todo).all()
    return todos

@app.post("/todos", response_model=Todo) 
async def create_todo(todo: TodoCreate):
    db = SessionLocal()
    db_todo = models.Todo(title=todo.title, completed=False)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    db.close()
    return db_todo

@app.put("/todos/{todo_id}/toggle", response_model=Todo)
async def toggle_todo(todo_id: int ,db = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo.completed = not todo.completed
    db.commit()
    db.refresh(todo)
    return todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int , db = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted"}

class TodoUpdate(BaseModel):
    title: str

@app.put("/todos/{todo_id}")
def updateTodo(todo_id: int , request_data:TodoUpdate ,db=Depends(get_db)):
    todo_item = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo_item:
        raise HTTPException(status_code=404, detail="Todo not found")
    todo_item.title = request_data.title

    db.add(todo_item)
    db.commit()
    return {"message": "Todo Updated"}


