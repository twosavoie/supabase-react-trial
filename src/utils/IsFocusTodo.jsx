function isFocusTodo(todo) {
  if (!todo.goal || todo.count >= todo.goal) return false;

  if (!todo.due_date) return true;

  const due = new Date(todo.due_date);
  const now = new Date();

  const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  return daysLeft <= 3;
}

export default isFocusTodo;
