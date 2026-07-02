import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Avatar from "./Avatar";
import PropTypes from "prop-types";
// import Theme from "./Theme";

function getStoredTheme() {
  if (typeof window === "undefined") {
    return "light-dark";
  }

  try {
    return window.localStorage.getItem("theme") || "light-dark";
  } catch {
    return "light-dark";
  }
}

function persistTheme(theme) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // Ignore storage errors
  }
}

const themeValues = {
  "light-dark": {
    "--bg-color-1": "#ffffff",
    "--bg-color-2": "#ffffff",
    "--bg-color-3": "#bce4f9",
    "--bg-color-4": "#f2fafe",
    "--my-gradient": "linear-gradient(#63bff005, #63bff040)",
    "--text-color": "#07124d",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#dc5a15",
    "--accent-color-2": "#f36500",
    "--accent-color-2-hover": "#ff6b00",
    "--accent-color-3": "#09415e",
  },
  light: {
    "--bg-color-1": "#ffffff",
    "--bg-color-2": "#ffffff",
    "--bg-color-3": "#bce4f9",
    "--bg-color-4": "#f2fafe",
    "--my-gradient": "linear-gradient(#63bff005, #63bff040)",
    "--text-color": "#07124d",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#dc5a15",
    "--accent-color-2": "#f36500",
    "--accent-color-2-hover": "#ff6b00",
    "--accent-color-3": "#09415e",
  },
  blue: {
    "--bg-color-1": "#a09dea",
    "--bg-color-2": "#a09dea",
    "--bg-color-3": "#a09dea",
    "--bg-color-4": "#a09dea",
    "--my-gradient": "linear-gradient(#63bff005, #63bff040)",
    "--text-color": "#07124d",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#09415e",
    "--accent-color-2": "#09415e",
    "--accent-color-2-hover": "#09415e",
    "--accent-color-3": "#09415e",
  },
  green: {
    "--bg-color-1": "#91e76a",
    "--bg-color-2": "#91e76a",
    "--bg-color-3": "#91e76a",
    "--bg-color-4": "#91e76a",
    "--my-gradient": "linear-gradient(#63bff005, #63bff040)",
    "--text-color": "#07124d",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#3d602d",
    "--accent-color-2": "#3d602d",
    "--accent-color-2-hover": "#3d602d",
    "--accent-color-3": "#3d602d",
  },
  dark: {
    "--bg-color-1": "#15122f",
    "--bg-color-2": "#0c0828",
    "--bg-color-3": "#0c0828",
    "--bg-color-4": "#0c0828",
    "--my-gradient": "linear-gradient(#63bff040, hsl(240, 44%, 6%))",
    "--text-color": "#f2e4e6",
    "--text-color-disabled": "#bbbbbb",
    "--text-color-placeholder": "#bbbbbb",
    "--accent-color-1": "#f493a4",
    "--accent-color-2": "#d7556c",
    "--accent-color-2-hover": "#ed5e77",
    "--accent-color-3": "#333",
  },
};

function applyTheme(themeName) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const values = themeValues[themeName] || themeValues["light-dark"];

  root.dataset.theme = themeName;
  root.classList.remove(
    "theme-light-dark",
    "theme-light",
    "theme-blue",
    "theme-green",
    "theme-dark",
  );
  root.classList.add(`theme-${themeName}`);

  if (body) {
    body.dataset.theme = themeName;
    body.classList.remove(
      "theme-light-dark",
      "theme-light",
      "theme-blue",
      "theme-green",
      "theme-dark",
    );
    body.classList.add(`theme-${themeName}`);
  }

  Object.entries(values).forEach(([property, value]) => {
    root.style.setProperty(property, value);
    if (body) {
      body.style.setProperty(property, value);
    }
  });
}

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const [theme, setTheme] = useState(() => getStoredTheme());
  const [avatar_url, setAvatarUrl] = useState(null);

  Account.propTypes = {
    session: PropTypes.object.isRequired,
  };

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`username, motivation, theme, avatar_url`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setUsername(data.username);
          setMotivation(data.motivation);
          setTheme(data.theme || getStoredTheme());
          setAvatarUrl(data.avatar_url);
          persistTheme(data.theme || getStoredTheme());
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  useEffect(() => {
    persistTheme(theme);
    applyTheme(theme);
  }, [theme]);

  async function updateProfile(event, avatarUrl) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      motivation,
      theme,
      avatar_url: avatarUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    } else {
      setAvatarUrl(avatarUrl);
    }
    setLoading(false);
  }

  return (
    <div className="account-form-widget">
      <h1>Account</h1>
      <p>Completing this form is totally optional. You do you! 🙂</p>
      <form onSubmit={updateProfile} className="form-widget form-layout">
        <div className="account-form-widget-elements">
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email} disabled />
        </div>
        <div className="account-form-widget-elements">
          <label htmlFor="username">Name</label>
          <input
            id="username"
            type="text"
            required
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="account-form-widget-elements">
          <label htmlFor="motivation">My motivational message</label>
          <input
            id="motivation"
            type="text"
            value={motivation || ""}
            maxLength="100"
            onChange={(e) => setMotivation(e.target.value)}
          />
        </div>
        {/* <Theme theme={theme} /> */}
        <div className="theme-color-picker account-form-widget-elements">
          <label>Pick a color scheme</label>
          <div className="theme-color-picker__colors">
            <label htmlFor="light-dark" className="visually-hidden">
              Light-Dark theme
            </label>
            <input
              type="radio"
              name="theme"
              id="light-dark"
              checked={theme === "light-dark"}
              onChange={() => setTheme("light-dark")}
            />

            <label htmlFor="light" className="visually-hidden">
              Light theme
            </label>
            <input
              type="radio"
              id="light"
              name="theme"
              checked={theme === "light"}
              onChange={() => setTheme("light")}
            />

            <label htmlFor="blue" className="visually-hidden">
              Blue theme
            </label>
            <input
              type="radio"
              id="blue"
              name="theme"
              checked={theme === "blue"}
              onChange={() => setTheme("blue")}
            />

            <label htmlFor="green" className="visually-hidden">
              Green theme
            </label>
            <input
              type="radio"
              id="green"
              name="theme"
              checked={theme === "green"}
              onChange={() => setTheme("green")}
            />

            <label htmlFor="dark" className="visually-hidden">
              Dark theme
            </label>
            <input
              type="radio"
              id="dark"
              name="theme"
              checked={theme === "dark"}
              onChange={() => setTheme("dark")}
            />
          </div>
        </div>
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(event, url) => {
            updateProfile(event, url);
          }}
        />

        <div className="account-form-widget-elements account-form-buttons">
          <button
            className="button block primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update Account"}
          </button>
          {/* * adding button here */}
          <button
            className="button block"
            type="button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
