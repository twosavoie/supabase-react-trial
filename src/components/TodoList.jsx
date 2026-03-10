import { useEffect } from "react";
import TodoItem from "./TodoItem";
import PropTypes from "prop-types";

TodoList.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};

function TodoList({ todos, setTodos, fetchTodos }) {
  console.log("TodoList todos:", todos);
  // * the linter doesn't like this but an empty dependency array creates 7 calls while adding fetchTodos to the dependency array creates 11. So I'm leaving this as is for now. I've also checked with GitHub Copilot.
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
          fetchTodos={fetchTodos}
        />
      ))}
    </ol>
  );
}

export default TodoList;
