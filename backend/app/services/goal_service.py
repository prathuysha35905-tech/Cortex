from datetime import datetime
from sqlalchemy.orm import Session

from app.models.goal import Goal
from app.schemas.goal import GoalCreate


def create_goal(
    db: Session,
    goal: GoalCreate,
    user_id: int
):
    new_goal = Goal(
        title=goal.title,
        description=goal.description,
        category=goal.category,
        target_date=goal.target_date,
        user_id=user_id
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def get_all_goals(
    db: Session,
    user_id: int
):
    return (
        db.query(Goal)
        .filter(
            Goal.user_id == user_id,
            Goal.is_archived == False
        )
        .all()
    )


def get_goal(
    db: Session,
    goal_id: int,
    user_id: int
):
    return (
        db.query(Goal)
        .filter(
            Goal.id == goal_id,
            Goal.user_id == user_id
        )
        .first()
    )


def update_goal(
    db: Session,
    goal_id: int,
    goal: GoalCreate,
    user_id: int
):
    existing_goal = get_goal(
        db,
        goal_id,
        user_id
    )

    if not existing_goal:
        return None

    existing_goal.title = goal.title
    existing_goal.description = goal.description
    existing_goal.category = goal.category
    existing_goal.target_date = goal.target_date

    db.commit()
    db.refresh(existing_goal)

    return existing_goal


def delete_goal(
    db: Session,
    goal_id: int,
    user_id: int
):
    goal = get_goal(
        db,
        goal_id,
        user_id
    )

    if not goal:
        return None

    db.delete(goal)
    db.commit()

    return goal


def archive_goal(
    db: Session,
    goal_id: int,
    user_id: int
):
    goal = get_goal(
        db,
        goal_id,
        user_id
    )

    if not goal:
        return None

    goal.is_archived = True

    db.commit()
    db.refresh(goal)

    return goal


def restore_goal(
    db: Session,
    goal_id: int,
    user_id: int
):
    goal = get_goal(
        db,
        goal_id,
        user_id
    )

    if not goal:
        return None

    goal.is_archived = False

    db.commit()
    db.refresh(goal)

    return goal


def update_progress(
    db: Session,
    goal_id: int,
    progress: int,
    user_id: int
):
    goal = get_goal(
        db,
        goal_id,
        user_id
    )

    if not goal:
        return None

    goal.progress = max(0, min(progress, 100))

    if goal.progress == 100:
        goal.status = "Completed"
    else:
        goal.status = "Active"

    goal.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(goal)

    return goal