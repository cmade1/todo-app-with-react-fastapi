from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Todo(Base):
    __tablename__ = "todo"

    id = Column(Integer , primary_key = True)
    title = Column(String)
    completed = Column(Boolean, default=False)
    position = Column(Integer, default=0)