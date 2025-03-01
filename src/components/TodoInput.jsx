// import { useState } from "react";
// import "../App.css";
// import Counter from "./Counter";
import PropTypes from "prop-types";

TodoInput.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
};
// import TodoItem from "./TodoItem";

function TodoInput({ todos, setTodos }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const value = event.target.todo.value;
    const newTodo = {
      title: value,
      id: self.crypto.randomUUID(),
      is_completed: false,
    };
    // Update todo state
    setTodos((prevTodos) => [...prevTodos, newTodo]);
    const updatedTodoList = JSON.stringify([...todos, newTodo]);
    localStorage.setItem("todos", updatedTodoList);
    //reset the form
    event.target.reset();
  };

  return (
    <div className="todo-input">
      <form onSubmit={handleSubmit}>
        <label htmlFor="todo" className="todo-input-label">
          Add a new todo
          <input
            type="text"
            // value={todo}
            name="todo"
            id="todo"
            placeholder="Add a new todo"
            // onChange={(event) => setTodos(event.target.value)}
          />
        </label>
        {/* TODO: Add an input for number */}
        {/* TODO: Add a what the count was specified here */}
        {/* TODO; Make the todo input field flex-grow 1 and the others to fill in */}
        {/* TODO: Pass to the TodoItem */}
        <label htmlFor="count" className="count-input-label">
          # of Times goal
          <input type="number" />
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
