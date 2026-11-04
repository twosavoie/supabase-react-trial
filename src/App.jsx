import "./App.css";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import Theme from "./components/Theme.jsx";

function App() {
  const [session, setSession] = useState(null);
  console.log("Session in App.jsx:", session);
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
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching todos:", error);
      return;
    }

    const deferDateDue = data.filter(
      (item) =>
        item.defer && item.defer_date && new Date(item.defer_date) < new Date(),
    );
    const updatedDueTodos = await Promise.all(
      deferDateDue.map(async (item) => {
        const { error: updateError } = await supabase
          .from("todos")
          .update({ defer: false })
          .eq("id", item.id);

        if (updateError) {
          console.error("Error updating deferred todo:", updateError);
          return item;
        }

        return { ...item, defer: false };
      }),
    );
    const updatedTodosById = new Map(
      updatedDueTodos.map((item) => [item.id, item]),
    );
    setTodos(data.map((item) => updatedTodosById.get(item.id) ?? item));
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
          <TodoList
            todos={todos}
            setTodos={setTodos}
            fetchTodos={fetchTodos}
            session={session}
          />
          {/* TODO: Remove theme from main App component but still load the current theme for the user https://claude.ai/share/4055a008-0373-429f-998e-e2c0fc85f626 */}
          <form className="theme-form">
            <Theme session={session} />
          </form>
          <Footer key={session.user.id} session={session} />
        </div>
      )}
    </div>
  );
}

export default App;
