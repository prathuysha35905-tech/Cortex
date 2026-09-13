from app.ai.goal_planner import generate_goal_plan

plan = generate_goal_plan("Become AI Engineer")

print("\nGoal:")
print(plan["goal"])

print("\nMilestones:")
for milestone in plan["milestones"]:
    print("-", milestone)

print("\nTasks:")
for task in plan["tasks"]:
    print("-", task["title"])