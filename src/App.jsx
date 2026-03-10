import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
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

  const fetchTodos = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });
    if (error) console.error("Error fetching todos:", error);
    else setTodos(data);
  }, [session]); // Only re-create if session changes

  return (
    <div className="container">
      {!session ? (
        <Auth />
      ) : (
        <div className="app-ui">
          {/* <Header key={session.user.id} session={session} /> */}
          <Header />
          <TodoInput
            session={session}
            todos={todos}
            setTodos={setTodos}
            fetchTodos={fetchTodos}
          />

          <TodoList todos={todos} setTodos={setTodos} fetchTodos={fetchTodos} />
          <Footer key={session.user.id} session={session} />
        </div>
      )}
    </div>
  );
}

// Source: https://www.freecodecamp.org/news/build-a-todo-app-from-scratch-with-reactjs/ original app
// Source: Use this video to make Account a dialog: https://www.youtube.com/watch?v=YwHJMlvZRCc
// Source: https://www.youtube.com/watch?app=desktop&v=yYIdFhkE3RU use Supabase rather than localStorage 24:42 for completed. Start at 29:06 next time
export default App;
