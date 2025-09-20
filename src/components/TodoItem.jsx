import { useEffect, useRef, useState } from "react";
// import "../App.css";
import PropTypes from "prop-types";
import Counter from "./Counter";
import { supabase } from "../supabaseClient";

TodoItem.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired, // Add this line
};

// ? Would the check if goals >= count go here or in Counter.jsx? How would I trigger confetti from here? Should it all go in Counter.jsx?
function TodoItem({ item, setTodos }) {
  // ? Does item include goal?
  // console.log("TodoItem item:", item);
  // console.log("TodoItem item.goal:", item.goal);
  // console.log("TodoItem item.todo_name:", item.todo_name);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  // from ChatGPT
  async function completeTodo(id) {
    const updatedStatus = !item.completed;

    const { error } = await supabase
      .from("todos")
      .update({ completed: updatedStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
      return;
    }

    // Update local state for instant UI feedback
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedStatus } : todo
      )
    );
  }

  // Automatically complete todo when count >= goal and not already completed. If count < goal, mark incomplete
  // * Can also cross off and uncross off an item. If the count changes this useEffect runs again and recrosses off the item if the count is >= goal. Not sure how I feel about this.
  useEffect(() => {
    if (typeof item.goal === "number" && item.goal > 0) {
      if (item.count >= item.goal && !item.completed) {
        completeTodo(item.id);
      } else if (item.count < item.goal && item.completed) {
        // Mark as incomplete if count drops below goal
        completeTodo(item.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.count, item.goal]);

  const handleEdit = () => {
    setEditing(true);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      // position the cursor at the end of the text
      // ? Why twice?
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [editing]);
  const handleInputSubmit = async (event) => {
    event.preventDefault();
    // Update Supabase after editing todo
    await saveEditedTodo();
  };
  const handleInputBlur = async () => {
    // Update Supabase after editing todo
    await saveEditedTodo();
  };

  async function saveEditedTodo() {
    const newName = item.todo_name;

    const { error } = await supabase
      .from("todos")
      .update({ todo_name: newName })
      .eq("id", item.id);

    if (error) {
      console.error("Error updating todo name:", error);
      return;
    }

    setEditing(false);
  }
  const handleInputChange = (e) => {
    const newName = e.target.value;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === item.id ? { ...todo, todo_name: newName } : todo
      )
    );
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("todos").delete().eq("id", item.id);

    if (error) {
      console.error("Error deleting todo:", error);
      return;
    }

    // Remove it locally for fast UI feedback
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== item.id));
  };

  return (
    <li id={item?.id} className="todo_item">
      {editing ? (
        <form className="edit-form" onSubmit={handleInputSubmit}>
          <label htmlFor="edit-todo">
            <input
              ref={inputRef}
              type="text"
              name="edit-todo"
              // defaultValue={item?.title}
              defaultValue={item?.todo_name}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
          </label>
        </form>
      ) : (
        <>
          <div className="todo_items_left">
            <label>
              <input
                type="checkbox"
                checked={!!item.completed}
                onChange={() => completeTodo(item.id)}
                aria-label={`Mark ${item.todo_name} as complete`}
              />
              <span
                style={
                  item.completed
                    ? {
                        textDecoration: "line-through",
                        textDecorationThickness: "3px",
                        // textDecorationColor: "#fbd8df",
                        // ? Add confetti component here?
                      }
                    : {}
                }
              >
                {item?.todo_name}
              </span>
            </label>
            {item.goal > 0 && <p className="goal">Goal: {item.goal}</p>}
          </div>
          {/* TODO: Add a ternary to check if count equals what was specified and if so confetti and todo item is crossed out by calling completeTodo functions */}
          <div className="todo_items_right">
            <Counter
              todoId={item.id}
              initialCount={item.count}
              setTodos={setTodos}
            />
            <div className="edit-delete-buttons">
              <button onClick={handleEdit}>
                <span className="visually-hidden">Edit</span>
                <svg
                  clipRule="evenodd"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={34}
                >
                  <path
                    d="m11.25 6c.398 0 .75.352.75.75 0 .414-.336.75-.75.75-1.505 0-7.75 0-7.75 0v12h17v-8.749c0-.414.336-.75.75-.75s.75.336.75.75v9.249c0 .621-.522 1-1 1h-18c-.48 0-1-.379-1-1v-13c0-.481.38-1 1-1zm1.521 9.689 9.012-9.012c.133-.133.217-.329.217-.532 0-.179-.065-.363-.218-.515l-2.423-2.415c-.143-.143-.333-.215-.522-.215s-.378.072-.523.215l-9.027 8.996c-.442 1.371-1.158 3.586-1.264 3.952-.126.433.198.834.572.834.41 0 .696-.099 4.176-1.308zm-2.258-2.392 1.17 1.171c-.704.232-1.274.418-1.729.566zm.968-1.154 7.356-7.331 1.347 1.342-7.346 7.347z"
                    fillRule="nonzero"
                  />
                </svg>
              </button>
              <button onClick={handleDelete}>
                <span className="visually-hidden">Delete</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  clipRule="evenodd"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  viewBox="0 0 24 24"
                  width={32}
                  height={34}
                >
                  <path
                    d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z"
                    fillRule="nonzero"
                  />
                </svg>
                {/* </div> */}
              </button>
            </div>
          </div>
        </>
      )}
    </li>
  );
}

export default TodoItem;
