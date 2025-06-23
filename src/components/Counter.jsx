import { useState } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

Counter.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  todoId: PropTypes.number.isRequired, // Add this line
  initialCount: PropTypes.number, // Add this line
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};

function Counter({ todoId, initialCount, setTodos }) {
  const [count, setCount] = useState(initialCount || 0);

  const incrementCount = async () => {
    const newCount = count + 1;
    setCount(newCount);

    // ✅ Update Supabase
    const { error } = await supabase
      .from("todos")
      .update({ count: newCount })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating count:", error);
      return;
    }

    // ✅ Update local state
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, count: newCount } : todo
      )
    );
  };

  // TODO: Separate the message from the onClick handler. Add increment and decrement count buttons.
  return (
    <div className="card">
      {/* <p>Count is {count}</p> */}
      <button onClick={incrementCount}>count is {count}</button>
    </div>
  );
}

export default Counter;
