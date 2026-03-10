// import { useEffect } from "react";
import TodoItem from "./TodoItem";
import PropTypes from "prop-types";

TodoList.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};

function TodoList({ todos, setTodos }) {
  console.log("TodoList todos:", todos);

  // no fetchTodos call in useEffect
  return (
    <ol className="todo_list">
      {todos.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          todos={item.todo_name}
          setTodos={setTodos}
        />
      ))}
    </ol>
  );
}

export default TodoList;
