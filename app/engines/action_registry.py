from app.engines.task_engine import execute_create_task
from app.engines.memory_engine import execute_save_memory

ACTION_REGISTRY = {
    "create_task": execute_create_task,
    "save_memory": execute_save_memory,
}