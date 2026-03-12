import { useEffect, useRef, useState, useMemo } from "react";
import PropTypes from "prop-types";
import Counter from "./Counter";
import TodoEdit from "./TodoEdit";
import Dialog from "./Dialog";
import { getGoalStats } from "../utils/getGoalStats";
import { supabase } from "../supabaseClient";

TodoItem.propTypes = {
  session: PropTypes.object,
  todos: PropTypes.array,
  setTodos: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
  isFocus: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number,
    todo_name: PropTypes.string,
    goal: PropTypes.number,
    count: PropTypes.number,
    completed: PropTypes.bool,
    updated_at: PropTypes.string,
    created_at: PropTypes.string,
    completed_at: PropTypes.string,
    due_date: PropTypes.string,
  }).isRequired,
};

function TodoItem({ item, setTodos, fetchTodos, isFocus }) {
  const [dialogContent, setDialogContent] = useState(null);
  const dialogRef = useRef(null);
  const [focusMode, setFocusMode] = useState(false);
  // const inputRef = useRef(null);

  // Parse YYYY-MM-DD string as local date (not UTC) to avoid timezone shifts
  // * Removed, not part of ChatGPT's code I believe because I'm no longer showing the date in the UI, instead showing the number of days left until the due date. I may add this back in if I decide to show the due date in the UI again. I don't really like this version
  // function parseLocalDate(dateStr) {
  //   if (!dateStr) return null;
  //   const parts = dateStr.split("T")[0].split("-");
  //   return new Date(
  //     parseInt(parts[0]),
  //     parseInt(parts[1]) - 1,
  //     parseInt(parts[2]),
  //   );
  // }

  // * Added ChatGPT
  const goalStats = useMemo(() => getGoalStats(item), [item]);

  // * Added ChatGPT
  // const dueDate = useMemo(() => {
  //   return parseLocalDate(item.due_date);
  // }, [item.due_date]);

  // ? Needed for current functionality? Keeping for now. I don't plan to mark items overdue but may be a good idea
  // ? Instead of marking isOverdue, could reduce the opacity of the due date text if it's past due and not completed
  // const isOverdue =
  //   item.due_date &&
  //   !item.completed &&
  //   parseLocalDate(item.due_date) < new Date();
  // const finishedOnTime =
  //   item.due_date &&
  //   item.completed &&
  //   new Date(item.due_date) >= new Date(item.updated_at || item.completed_at);

  // * Added ChatGPT uses overdue which I may not use
  // const deadlineStats = useMemo(() => {
  //   if (!dueDate) {
  //     return {
  //       isOverdue: false,
  //       daysLeft: null,
  //       goalMet: item.goal > 0 && item.count >= item.goal,
  //       goalMetOnTime: item.goal > 0 && item.count >= item.goal,
  //     };
  //   }

  //   const now = new Date();
  //   const diff = dueDate - now;
  //   const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  //   const goalMet = item.goal > 0 && item.count >= item.goal;

  //   return {
  //     isOverdue: !item.completed && daysLeft < 0,
  //     daysLeft,
  //     goalMet,
  //     goalMetOnTime: goalMet && daysLeft >= 0,
  //   };
  // }, [dueDate, item.completed, item.goal, item.count]);

  // * Added ChatGPT moved to utils/getGoalStats.jsx
  // const goalStats = useMemo(() => {
  //   const dueDate = item.due_date ? parseLocalDate(item.due_date) : null;

  //   const goalMet = item.goal > 0 && item.count >= item.goal;

  //   const goalMetOnTime = goalMet && (!dueDate || new Date() <= dueDate);

  //   const daysLeft = dueDate
  //     ? Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
  //     : null;

  //   return {
  //     dueDate,
  //     daysLeft,
  //     goalMet,
  //     goalMetOnTime,
  //   };
  // }, [item.due_date, item.goal, item.count]);

  //* Added ChatGPT not sure where this goes
  // const { isOverdue, daysLeft } = deadlineStats;

  // * Added ChatGPT commented for now since I'm not currently firing confetti
  // useEffect(() => {
  //   if (deadlineStats.goalMetOnTime) {
  //     triggerConfetti();
  //   }
  // }, [deadlineStats.goalMetOnTime]);

  // * Added ChatGPT commented for now since I'm not currently firing confetti
  //   useEffect(() => {
  //   if (goalStats.goalMetOnTime) {
  //     triggerConfetti();
  //   }
  // }, [goalStats.goalMetOnTime]);

  // * Added ChatGPT commented for now since I'm not currently firing confetti
  // const confettiTriggered = useRef(false);

  // useEffect(() => {
  //   if (goalStats.goalMetOnTime && !confettiTriggered.current) {
  //     triggerConfetti();
  //     confettiTriggered.current = true;
  //   }
  // }, [goalStats.goalMetOnTime]);

  // async function completeTodo(id) {
  //   const updatedStatus = !item.completed;

  //   const { error } = await supabase
  //     .from("todos")
  //     .update({ completed: updatedStatus })
  //     .eq("id", id);

  //   if (error) {
  //     console.error("Error updating todo:", error);
  //     return;
  //   }

  //   setTodos((prevTodos) =>
  //     prevTodos.map((todo) =>
  //       todo.id === id ? { ...todo, completed: updatedStatus } : todo,
  //     ),
  //   );
  // }

  // * Added ChatGPT to avoid a race condition because of fast repeated clicks or counter updates triggering completion simultaneously
  // async function completeTodo(id) {
  //   let updatedStatus;

  //   setTodos((prevTodos) =>
  //     prevTodos.map((todo) => {
  //       if (todo.id === id) {
  //         updatedStatus = !todo.completed;
  //         return { ...todo, completed: updatedStatus };
  //       }
  //       return todo;
  //     }),
  //   );

  //   const { error } = await supabase
  //     .from("todos")
  //     .update({ completed: updatedStatus })
  //     .eq("id", id);

  //   if (error) {
  //     console.error("Error updating todo:", error);
  //   }
  // }

  // * Added ChatGPT to make completeTodo toggle-free. Not sure if I've called the function correctly in the useEffect below
  // * This super doesn't work because it always sets completed to true, even when the goal is no longer met. Before if the counter was changed downward, the todo item would be marked as incomplete but now it stays completed.
  async function setTodoCompletion(id, completed) {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
    );

    await supabase.from("todos").update({ completed }).eq("id", id);
  }

  useEffect(() => {
    if (typeof item.goal === "number" && item.goal > 0) {
      if (item.count >= item.goal && !item.completed) {
        setTodoCompletion(item.id, true);
        // completeTodo(item.id);
      } else if (item.count < item.goal && item.completed) {
        setTodoCompletion(item.id, true);
        // completeTodo(item.id);
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
    // <li id={item?.id} className="todo_item">
    <li className={`todo_item ${isFocus ? "focus" : ""}`}>
      <>
        <div className="todo_items_left">
          <label>
            <input
              type="checkbox"
              checked={!!item.completed}
              // onChange={() => completeTodo(item.id)}
              // onChange={() => setTodoCompletion(item.id, !item.completed)}
              onChange={() => setTodoCompletion(item.id, true)}
              aria-label={`Mark ${item.todo_name} as complete`}
            />
            <span
              style={
                item.completed
                  ? {
                      textDecoration: "line-through",
                      textDecorationThickness: "1px",
                    }
                  : {}
              }
            >
              {item?.todo_name}
            </span>
          </label>
          <div className="goal-due-date">
            {item.goal > 0 && <p className="goal">Goal: {item.goal}</p>}
            {/* Adds the class "overdue" to the due date if it's past due and not completed. Maybe reduce the opacity to indicate it's overdue  */}
            {/* * Start */}
            {/* {item.due_date && (
              <p className={"due-date" + (isOverdue ? " overdue" : "")}>
                By: {parseLocalDate(item.due_date).toLocaleDateString()}
              </p>
            )} */}
            {/* * first ChatGPT version, showing due date in UI but not days left until due date */}
            {/* {dueDate && (
              <p className={"due-date" + (isOverdue ? " overdue" : "")}>
                By: {dueDate.toLocaleDateString()}
              </p>
            )} */}
            {/* * second ChatGPT version, showing days left until due date in UI but not the due date itself.  */}
            {/* {goalStats.dueDate &&
              goalStats.daysLeft !== null &&
              goalStats.daysLeft >= 0 && (
                <p className="due-date">
                  {goalStats.daysLeft} day{goalStats.daysLeft === 1 ? "" : "s"}{" "}
                  left
                </p>
              )} */}
            {goalStats.daysLeft !== null && goalStats.daysLeft >= 0 && (
              <p className="due-date">
                {goalStats.daysLeft} day{goalStats.daysLeft === 1 ? "" : "s"}{" "}
                left
              </p>
            )}
          </div>
        </div>
        {/* * Doesn't add anything to the UI but I like having it here to visually represent progress toward the goal in the code. I may add this to the UI in the future as a progress bar or something similar. */}
        <div className="progress_bar">
          <div
            className="progress_fill"
            style={{ width: `${(item.count / item.goal) * 100}%` }}
          />
        </div>
        <button
          className="focus-toggle"
          onClick={() => setFocusMode((prev) => !prev)}
        >
          {focusMode ? "Show All Tasks" : "Focus Today"}
        </button>
        {isFocus && (
          <p className="focus-hint">A great one to make progress on today</p>
        )}
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
