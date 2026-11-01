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
  // ? Is this where I would check deferred todos to see if they should be moved to the active list based on the current date? Or in the TodoItem component?
  // * the linter doesn't like this but an empty dependency array creates 7 calls while adding fetchTodos to the dependency array creates 11. So I'm leaving this as is for now. I've also checked with GitHub Copilot. Should I completely remove the array?
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <ol className="todo_list">
        {todos
          .filter((item) => !item.completed && !item.defer)
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              todos={item.todo_name}
              setTodos={setTodos}
              fetchTodos={fetchTodos}
            />
          ))}
      </ol>
      <h2 className="deferred-todos-header">Deferred Todos:</h2>
      <ol className="todo_list">
        {todos
          .filter((item) => item.defer && !item.completed)
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              todos={item.todo_name}
              setTodos={setTodos}
              fetchTodos={fetchTodos}
            />
          ))}
      </ol>
      <h2 className="completed-todos-header">Completed Todos:</h2>
      <ol className="todo_list">
        {todos
          .filter((item) => item.completed)
          .map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              todos={item.todo_name}
              setTodos={setTodos}
              fetchTodos={fetchTodos}
            />
          ))}
      </ol>
    </>
  );
}

export default TodoList;
