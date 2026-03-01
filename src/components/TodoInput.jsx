import { useState } from "react";
// import "../App.css";
// import Counter from "./Counter";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

TodoInput.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  todo_name: PropTypes.string,
  setTodo_name: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};

function TodoInput({ fetchTodos, session }) {
  const [todo_name, setTodo_name] = useState("");
  const [goal, setGoal] = useState(0);
  // Used for days to complete
  const [daysToComplete, setDaysToComplete] = useState("");
  // Was used when input field was date
  // const [dueDate, setDueDate] = useState(""); // new state for the "by" date

  // Source: https://claude.ai/share/44716456-b609-4ac6-a10a-3ed916cb6fad
  // Used for days to complete - date is at midnight on the date
  const calcDueDate = (days) => {
    if (!days || days <= 0) return null;
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  // Used for days to complete at 11:59pm on the due date - not shown in db, use other suggestions if you want a human-readable date in the db
  // const calcDueDate = (days) => {
  //   if (!days || days <= 0) return null;
  //   const date = new Date();
  //   date.setDate(date.getDate() + Number(days));
  //   // Set to 11:59 PM in the user's local time
  //   date.setHours(23, 59, 0, 0);
  //   return date.toISOString(); // Converts to UTC, but preserves the intent
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Used for days to complete
    const dueDate = calcDueDate(daysToComplete);
    await addTodo(
      todo_name,
      goal,
      dueDate,
      setTodo_name,
      setGoal,
      // Used for days to complete
      () => setDaysToComplete(""),
      // Was used when input field was date
      // setDueDate,
      fetchTodos,
      session.user.id,
    );
  };

  async function addTodo(
    todo_name,
    goal,
    dueDate,
    setTodo_name,
    setGoal,
    setDueDate,
    fetchTodos,
    userId,
  ) {
    if (!todo_name.trim()) return;
    const { error } = await supabase.from("todos").insert([
      {
        todo_name,
        user_id: userId,
        goal: goal ? Number(goal) : 0,
        due_date: dueDate || null,
      },
    ]);
    if (error) console.error("Error inserting todo:", error);
    else {
      setTodo_name("");
      setGoal(0);
      setDueDate("");
      fetchTodos();
    }
  }
  return (
    <div className="todo-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="todo_name" className="todo-input-label">
          Click here to add a new todo:
          <input
            type="text"
            value={todo_name}
            name="todo_name"
            id="todo_name"
            placeholder="e.g., Relax with a K-Drama and a hot cocoa"
            onChange={(event) => setTodo_name(event.target.value)}
          />
        </label>
        <label htmlFor="goal" className="count-input-label">
          Set a Goal:
          <input
            type="number"
            value={goal}
            name="goal"
            id="goal"
            onChange={(event) => setGoal(event.target.value)}
          />
        </label>
        {/* Used for days to complete */}
        <label htmlFor="days-to-complete" className="date-input-label">
          Complete within (days):
          <input
            type="number"
            value={daysToComplete}
            name="days-to-complete"
            id="days-to-complete"
            min="1"
            placeholder="e.g., 7"
            onChange={(event) => setDaysToComplete(event.target.value)}
          />
        </label>
        {/* Was used when input field was date */}
        {/* <label htmlFor="due-date" className="date-input-label">
          Complete by:
          <input
            type="date"
            value={dueDate}
            name="due-date"
            id="due-date"
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label> */}
        <button>
          <span className="visually-hidden">Submit</span>
          <svg
            clipRule="evenodd"
            fillRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
          >
            <path
              d="m11 11h-7.25c-.414 0-.75.336-.75.75s.336.75.75.75h7.25v7.25c0 .414.336.75.75.75s.75-.336.75-.75v-7.25h7.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.25v-7.25c0-.414-.336-.75-.75-.75s-.75.336-.75.75z"
              fillRule="nonzero"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default TodoInput;
