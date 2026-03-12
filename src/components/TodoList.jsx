import { useEffect, useMemo } from "react";
import TodoItem from "./TodoItem";
import PropTypes from "prop-types";
import isFocusTodo from "../utils/IsFocusTodo";

TodoList.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
  focusMode: PropTypes.bool.isRequired,
};

function TodoList({ todos, setTodos, fetchTodos, focusMode }) {
  console.log("TodoList todos:", todos);
  // * the linter doesn't like this but an empty dependency array creates 7 calls while adding fetchTodos to the dependency array creates 11. So I'm leaving this as is for now. I've also checked with GitHub Copilot.
  useEffect(() => {
    fetchTodos();
  }, []);

  // * ChatGPT may not be in the correct place
  const sortedTodos = useMemo(() => {
    if (!focusMode) return todos;

    return [...todos].sort((a, b) => {
      const aFocus = isFocusTodo(a);
      const bFocus = isFocusTodo(b);

      return bFocus - aFocus;
    });
  }, [todos, focusMode]);

  return (
    <ol className="todo_list">
      {/* {todos.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          todos={item.todo_name}
          setTodos={setTodos}
          fetchTodos={fetchTodos}
        />
      ))} */}
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          item={todo}
          isFocus={focusMode && isFocusTodo(todo)}
          setTodos={setTodos}
        />
      ))}
    </ol>
  );
}

export default TodoList;
