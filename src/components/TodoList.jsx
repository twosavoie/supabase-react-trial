import { useEffect } from "react";
// import "../App.css";
import TodoItem from "./TodoItem";
import PropTypes from "prop-types";

TodoList.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};

function TodoList({ todos, setTodos, fetchTodos }) {
  useEffect(() => {
    fetchTodos();
  }, []);

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
