import "./App.css";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TodoInput from "./components/TodoInput.jsx";
import TodoList from "./components/TodoList.jsx";
import PropTypes from "prop-types";

function App() {
  const [session, setSession] = useState(null);
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);

  App.propTypes = {
    session: PropTypes.object,
    todos: PropTypes.array,
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired,
    setTodos: PropTypes.func.isRequired,
    fetchTodos: PropTypes.func.isRequired,
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function fetchTodos() {
    if (!session) return;
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });
    if (error) console.error("Error fetching todos:", error);
    else setTodos(data);
  }

  async function fetchUser() {
    if (!session) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (error) console.error("Error fetching user profile:", error);
    else setUser(data);
  }

  useEffect(() => {
    fetchTodos();
    fetchUser();
  }, [session]);

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
          {/* ? works on save but not on refresh. The autocomplete comment: Need to add fetchTodos to useEffect in TodoList.jsx and pass fetchTodos as a prop from App.jsx to TodoList.jsx Not sure if I need this */}
          <p>Hello, {user.username}</p>
          {user.motivation && <p className="motivation">{user.motivation}</p>}
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
