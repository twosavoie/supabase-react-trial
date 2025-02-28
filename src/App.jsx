import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Header from "./components/Header";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Retrieve data from localStorage when component mounts
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <>
          <Header key={session.user.id} session={session} />
          <TodoInput
            key={session.user.id}
            session={session}
            todos={todos}
            setTodos={setTodos}
          />
          <TodoList
            key={session.user.id}
            session={session}
            todos={todos}
            setTodos={setTodos}
          />
        </>
      )}
    </div>
  );
}
// * Use this video to make Account a dialog: https://www.youtube.com/watch?v=YwHJMlvZRCc

export default App;
