import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

TodoEdit.propTypes = {
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  item: PropTypes.shape({
    id: PropTypes.number,
    todo_name: PropTypes.string,
    goal: PropTypes.number,
    count: PropTypes.number,
    completed: PropTypes.bool,
    due_date: PropTypes.string,
  }).isRequired,
};

export default function TodoEdit({ item, setTodos, onClose }) {
  // const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  function calcDaysFromDueDate(dueDate) {
    if (!dueDate) {
      return "";
    }
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : "";
  }

  const [todo_name, setTodo_name] = useState(item?.todo_name || "");
  const [goal, setGoal] = useState(item?.goal || "");
  const [daysToComplete, setDaysToComplete] = useState(
    calcDaysFromDueDate(item?.due_date),
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dueDate = calcDueDate(daysToComplete);
    await updateTodo(item.id, todo_name, goal, dueDate);
  };

  function calcDueDate(days) {
    if (!days || isNaN(days) || days <= 0) {
      return null;
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Number(days));
    return dueDate.toISOString().split("T")[0];
  }

  async function updateTodo(id, name, goal, dueDate) {
    const { data, error } = await supabase
      .from("todos")
      .update({
        todo_name: name,
        goal: goal && goal > 0 ? Number(goal) : 0,
        due_date: dueDate || null,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating todo:", error);
      return;
    }

    // Update parent component's state with the updated todo
    if (data && data.length > 0) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? data[0] : todo)),
      );
      // Close the dialog after successful update
      if (onClose) {
        onClose();
      }
    }
  }

  return (
    <div className="todo-edit-form-widget">
      <div className="todo-input">
        <form onSubmit={handleSubmit}>
          <label htmlFor="todo_name" className="todo-input-label">
            Click here to update todo:
            <input
              ref={inputRef}
              type="text"
              name="edit-todo"
              value={todo_name}
              onChange={(event) => setTodo_name(event.target.value)}
            />
          </label>
          <label htmlFor="goal" className="count-input-label">
            Update Your Goal:
            <input
              type="number"
              value={goal}
              name="edit-goal"
              onChange={(event) => setGoal(event.target.value)}
            />
          </label>
          {/* Used for days to complete */}
          <label htmlFor="days-to-complete" className="date-input-label">
            Over # of days:
            <input
              type="number"
              name="edit-days-to-complete"
              value={daysToComplete}
              onChange={(event) => setDaysToComplete(event.target.value)}
            />
          </label>
          <div className="submit-button">
            <button type="submit">Update Todo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
