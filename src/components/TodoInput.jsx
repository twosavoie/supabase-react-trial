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
  // TODO: add a "By:" date
  const handleSubmit = async (event) => {
    event.preventDefault();
    await addTodo(
      todo_name,
      goal,
      setTodo_name,
      setGoal,
      fetchTodos,
      session.user.id
    );
  };
  async function addTodo(
    todo_name,
    goal,
    setTodo_name,
    setGoal,
    fetchTodos,
    userId
  ) {
    if (!todo_name.trim()) return;
    const { error } = await supabase
      .from("todos")
      .insert([{ todo_name, user_id: userId, goal: goal ? Number(goal) : 0 }]);
    if (error) console.error("Error inserting todo:", error);
    else {
      setTodo_name("");
      setGoal(0);
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
            placeholder="For instance, Relax with a K-Drama and a cup of cocoa"
            onChange={(event) => setTodo_name(event.target.value)}
          />
        </label>
        {/* TODO: Add an input for number */}
        {/* TODO: Add a what the count was specified here */}
        {/* TODO; Make the todo input field flex-grow 1 and the others to fill in */}
        {/* TODO: Pass to the TodoItem */}
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
        {/* <Counter /> */}
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
