import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

TodoEdit.propTypes = {
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func,
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

export default function TodoEdit({ item, setTodos, fetchTodos, onClose }) {
  // const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  function calcDaysFromDueDate(dueDate) {
    if (!dueDate) {
      return "";
    }
    // strip time portion if present
    const dateOnly = dueDate.split("T")[0];
    const today = new Date();
    const due = new Date(dateOnly);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // convert difference back to inclusive days count
    const days = diffDays + 1;
    return days > 0 ? days : "";
  }

  const [todo_name, setTodo_name] = useState(item?.todo_name || "");
  const [goal, setGoal] = useState(item?.goal || "");
  // ensure the due date is in YYYY-MM-DD format for the <input type="date">
  const formattedDue = item?.due_date ? item.due_date.split("T")[0] : "";
  const [dueDate, setDueDate] = useState(formattedDue);
  const [daysToComplete, setDaysToComplete] = useState(
    calcDaysFromDueDate(formattedDue),
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // use the current dueDate state (computed either directly or via daysToComplete)
    await updateTodo(item.id, todo_name, goal, dueDate);
  };

  function calcDueDate(days) {
    if (!days || isNaN(days) || days <= 0) {
      return null;
    }
    const dueDate = new Date();
    // subtract 1 so that 1 day means today, 2 means tomorrow, etc.
    dueDate.setDate(dueDate.getDate() + Number(days) - 1);
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
      // Refresh full list to ensure other fields (like due_date) are in sync
      if (fetchTodos) {
        fetchTodos();
      }
      // Close the dialog after successful update
      if (onClose) {
        onClose();
      }
    }
  }

  return (
    <div className="todo-edit-form-widget">
      <div className="edit-todo-input">
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
            New Goal:
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
              onChange={(event) => {
                const val = event.target.value;
                setDaysToComplete(val);
                setDueDate(calcDueDate(val) || "");
              }}
            />
          </label>

          {/* direct due date input */}
          {/* * Making the dueDate directly editable required multiple changes because dates are tricky considering time zones and the fact that the backend stores them in ISO format. If issues, may revert to the previous version where the dueDate was editable only by changing the daysToComplete field, which was simpler but less user-friendly. */}
          <label htmlFor="due-date" className="date-input-label">
            Due date:
            <input
              type="date"
              name="edit-due-date"
              value={dueDate}
              onChange={(e) => {
                const val = e.target.value;
                setDueDate(val);
                setDaysToComplete(calcDaysFromDueDate(val));
              }}
            />
          </label>
          <div className="submit-edit-button">
            <button type="submit">Update Todo</button>
          </div>
        </form>
      </div>
    </div>
  );
}
