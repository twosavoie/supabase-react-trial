export function getGoalStats(todo) {
  const dueDate = todo.due_date ? new Date(todo.due_date) : null;

  const goalMet = todo.goal > 0 && todo.count >= todo.goal;

  const goalMetOnTime = goalMet && (!dueDate || new Date() <= dueDate);

  const daysLeft = dueDate
    ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return {
    dueDate,
    daysLeft,
    goalMet,
    goalMetOnTime,
  };
}
