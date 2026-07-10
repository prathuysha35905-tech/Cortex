from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate
from datetime import datetime


def create_task(
    db: Session,
    task: TaskCreate,
    user_id: int
):
    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        category=task.category,
        deadline=task.deadline,
        is_recurring=task.is_recurring,
        recurrence=task.recurrence,
        user_id=user_id

    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task
    

def get_all_tasks(
    db: Session,
    user_id: int
):
    return (
        db.query(Task)
        .filter(Task.user_id == user_id)
        .all()
    )

def get_task(db: Session, task_id: int):
    """
    Return one task by ID.
    """
    return db.query(Task).filter(Task.id == task_id).first()


def update_task(db: Session, task_id: int, task: TaskCreate):
    existing_task = db.query(Task).filter(Task.id == task_id).first()

    if not existing_task:
        return None

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.priority = task.priority
    existing_task.category = task.category
    existing_task.deadline = task.deadline
    existing_task.is_recurring = task.is_recurring
    db.commit()
    db.refresh(existing_task)

    return existing_task

def delete_task(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return None

    db.delete(task)
    db.commit()

    return task
def generate_recurring_tasks(db: Session):

    today = datetime.today().strftime("%A")

    recurring_tasks = (
        db.query(Task)
        .filter(Task.is_recurring == True)
        .all()
    )

    generated = []

    for task in recurring_tasks:

        if task.recurrence == "Daily":

            generated.append(task)

        elif today in task.recurrence:

            generated.append(task)

    return generated
