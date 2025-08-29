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
  // ? Does this work? Is goal within todos?
  console.log("TodoList todos:", todos);
  // ? Add fetchTodos to the dependency array to ensure the latest version is used? Does it cause it to re-fetch too often? Even without it, it seems to re-fetch often.
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
          // ? Pass item.goal? Is it needed? Is it already in item?
          // goal={item.goal}
          setTodos={setTodos}
          fetchTodos={fetchTodos}
        />
      ))}
    </ol>
  );
}

export default TodoList;
