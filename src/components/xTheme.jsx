import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

export default function Theme({ session }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "light-dark";
    } catch {
      return "light-dark";
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      if (!session) return;
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select("theme")
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setTheme(data.theme || "light-dark");
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
    try {
      const root = document.documentElement;
      const previousThemeClass = root.className.match(/theme-\S+/g)?.[0] || "";

      root.dataset.theme = theme;
      root.classList.remove(previousThemeClass);
      root.classList.add(`theme-${theme}`);
      localStorage.setItem("theme", theme);
    } catch {
      // ignore in non-browser environments
    }
  }, [theme]);

  async function handleThemeChange(nextTheme) {
    setTheme(nextTheme);

    try {
      const root = document.documentElement;
      const previousThemeClass = root.className.match(/theme-\S+/g)?.[0] || "";

      root.dataset.theme = nextTheme;
      root.classList.remove(previousThemeClass);
      root.classList.add(`theme-${nextTheme}`);
      localStorage.setItem("theme", nextTheme);
    } catch {
      // ignore in non-browser environments
    }

    if (!session?.user?.id) return;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: session.user.id,
        theme: nextTheme,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("Error updating theme:", error);
    }
  }

  return (
    <div className="theme-color-picker account-form-widget-elements">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {/* <form className="color-picker"> */}
          <label>Pick a color scheme</label>
          <div className="theme-color-picker__colors">
            <label htmlFor="light-dark" className="visually-hidden">
              Light/Dark default theme
            </label>
            <input
              type="radio"
              id="light-dark"
              name="theme"
              checked={theme === "light-dark"}
              onChange={() => handleThemeChange("light-dark")}
            />

            <label htmlFor="light" className="visually-hidden">
              Light theme
            </label>
            <input
              type="radio"
              id="light"
              name="theme"
              checked={theme === "light"}
              onChange={() => handleThemeChange("light")}
            />

            <label htmlFor="blue" className="visually-hidden">
              Blue theme
            </label>
            <input
              type="radio"
              id="blue"
              name="theme"
              checked={theme === "blue"}
              onChange={() => handleThemeChange("blue")}
            />

            <label htmlFor="green" className="visually-hidden">
              Green theme
            </label>
            <input
              type="radio"
              id="green"
              name="theme"
              checked={theme === "green"}
              onChange={() => handleThemeChange("green")}
            />

            <label htmlFor="dark" className="visually-hidden">
              Dark theme
            </label>
            <input
              type="radio"
              id="dark"
              name="theme"
              checked={theme === "dark"}
              onChange={() => handleThemeChange("dark")}
            />
          </div>
          {/* </form> */}
        </div>
      )}
    </div>
  );
}

Theme.propTypes = {
  session: PropTypes.object,
};
