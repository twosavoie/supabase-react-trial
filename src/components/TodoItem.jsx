import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Counter from "./Counter";
import TodoEdit from "./TodoEdit";
import Dialog from "./Dialog";
import { supabase } from "../supabaseClient";

TodoItem.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    todo_name: PropTypes.string,
    goal: PropTypes.number,
    count: PropTypes.number,
    completed: PropTypes.bool,
    due_date: PropTypes.string,
  }).isRequired,
};

function TodoItem({ item, setTodos, fetchTodos }) {
  const [dialogContent, setDialogContent] = useState(null);
  const dialogRef = useRef(null);
  // const inputRef = useRef(null);

  // Parse YYYY-MM-DD string as local date (not UTC) to avoid timezone shifts
  function parseLocalDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split("T")[0].split("-");
    return new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    );
  }

  // ? Needed for current functionality? Keeping for now. I don't plan to mark items overdue but may be a good idea
  // ? Instead of marking isOverdue, could reduce the opacity of the due date text if it's past due and not completed
  const isOverdue =
    item.due_date &&
    !item.completed &&
    parseLocalDate(item.due_date) < new Date();
  // const finishedOnTime =
  //   item.due_date &&
  //   item.completed &&
  //   new Date(item.due_date) >= new Date(item.updated_at || item.completed_at);

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

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedStatus } : todo,
      ),
    );
  }

  useEffect(() => {
    if (typeof item.goal === "number" && item.goal > 0) {
      if (item.count >= item.goal && !item.completed) {
        completeTodo(item.id);
      } else if (item.count < item.goal && item.completed) {
        completeTodo(item.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.count, item.goal]);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const handleDelete = async () => {
    if (
      !window.confirm(`Are you sure you want to delete "${item.todo_name}"?`)
    ) {
      return;
    }

    const { error } = await supabase.from("todos").delete().eq("id", item.id);

    if (error) {
      console.error("Error deleting todo:", error);
      return;
    }

    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== item.id));
  };

  return (
    <li id={item?.id} className="todo_item">
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
                    }
                  : {}
              }
            >
              {item?.todo_name}
            </span>
          </label>
          <div className="goal-due-date">
            {item.goal > 0 && <p className="goal">Goal: {item.goal}</p>}
            {item.due_date && (
              <p className={"due-date" + (isOverdue ? " overdue" : "")}>
                By: {parseLocalDate(item.due_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="todo_items_right">
          <Counter
            todoId={item.id}
            initialCount={item.count}
            setTodos={setTodos}
          />
          <div className="edit-delete-buttons">
            <button
              onClick={() => {
                setDialogContent(
                  <TodoEdit
                    key={item.id}
                    item={item}
                    setTodos={setTodos}
                    fetchTodos={fetchTodos}
                    onClose={toggleDialog}
                  />,
                );
                toggleDialog();
              }}
            >
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
            </button>
          </div>
        </div>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </>
    </li>
  );
}

export default TodoItem;
