from sqlalchemy.orm import Session

from app.models.task import Task
from app.schemas.task import TaskCreate
from datetime import datetime
from sqlalchemy import or_
from sqlalchemy import func


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
    user_id: int,
    page: int = 1,
    size: int = 10
):
    offset = (page - 1) * size

    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.is_archived == False
        )
        .offset(offset)
        .limit(size)
        .all()
    )


def search_tasks(
    db: Session,
    user_id: int,
    query: str
):
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.is_archived == False,
            or_(
                Task.title.ilike(f"%{query}%"),
                Task.description.ilike(f"%{query}%")
            )
        )
        .all()
    )


def filter_tasks(
    db: Session,
    user_id: int,
    priority: str | None = None,
    category: str | None = None,
    status: str | None = None
):
    print("Priority:", priority)
    print("Category:", category)
    print("Status:", status)

    query = db.query(Task).filter(
        Task.user_id == user_id,
        Task.is_archived == False
    )

    if priority:
        query = query.filter(
            func.lower(Task.priority) == priority.lower()
        )

    if category:
        query = query.filter(
            func.lower(Task.category) == category.lower()
        )

    if status:
        query = query.filter(
            func.lower(Task.status) == status.lower()
        )

    results = query.all()

    print("Results:", results)

    return results

def get_archived_tasks(
    db: Session,
    user_id: int
):
    return (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.is_archived == True
        )
        .all()
    )

def get_task(
    db: Session,
    task_id: int,
    user_id: int
):
    return (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )


def update_task(
    db: Session,
    task_id: int,
    task: TaskCreate,
    user_id: int
):
    existing_task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not existing_task:
        return None

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.priority = task.priority
    existing_task.category = task.category
    existing_task.deadline = task.deadline
    existing_task.is_recurring = task.is_recurring
    existing_task.recurrence = task.recurrence

    db.commit()
    db.refresh(existing_task)

    return existing_task

    

def delete_task(
    db: Session,
    task_id: int,
    user_id: int
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        return None

    db.delete(task)
    db.commit()

    return task


def archive_task(
    db: Session,
    task_id: int,
    user_id: int
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        return None

    task.is_archived = True
    task.archived_at = datetime.utcnow()

    db.commit()
    db.refresh(task)

    return task


def restore_task(
    db: Session,
    task_id: int,
    user_id: int
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        return None

    task.is_archived = False
    task.archived_at = None

    db.commit()
    db.refresh(task)

    return task


def complete_task(
    db: Session,
    task_id: int,
    user_id: int
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        return None

    task.status = "Completed"

    db.commit()
    db.refresh(task)

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
