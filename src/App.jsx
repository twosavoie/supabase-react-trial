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

  async function fetchTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) console.error("Error fetching todos:", error);
    else setTodos(data);
  }

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <>
          <Header key={session.user.id} session={session} />
          <TodoInput
            // key={session.user.id}
            // session={session}
            todos={todos}
            setTodos={setTodos}
            fetchTodos={fetchTodos}
          />
          <TodoList
            // key={session.user.id}
            // session={session}
            todos={todos}
            setTodos={setTodos}
            fetchTodos={fetchTodos}
          />
        </>
      )}
    </div>
  );
}
// * Use this video to make Account a dialog: https://www.youtube.com/watch?v=YwHJMlvZRCc
// * https://www.youtube.com/watch?app=desktop&v=yYIdFhkE3RU use Supabase rather than localStorage 24:42 for completed. Start at 29:06 next time
export default App;
