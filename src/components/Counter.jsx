import { useState } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

Counter.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  todoId: PropTypes.number.isRequired,
  initialCount: PropTypes.number,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};

function Counter({ todoId, initialCount, setTodos }) {
  const [count, setCount] = useState(initialCount || 0);

  const incrementCount = async () => {
    const newCount = count + 1;
    setCount(newCount);

    const { error } = await supabase
      .from("todos")
      .update({ count: newCount })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating count:", error);
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, count: newCount } : todo,
      ),
    );
  };

  const decrementCount = async () => {
    const newCount = count - 1;
    setCount(newCount);

    const { error } = await supabase
      .from("todos")
      .update({ count: newCount })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating count:", error);
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, count: newCount } : todo,
      ),
    );
  };

  return (
    <>
      <fieldset className="card">
        <legend className="visually-hidden">Counter for this todo</legend>
        <p aria-live="polite">{count}</p>
        <button
          type="button"
          aria-label="Increase count"
          onClick={incrementCount}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Decrease count"
          onClick={decrementCount}
        >
          -
        </button>
      </fieldset>
    </>
  );
}

export default Counter;
