import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

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
    "--my-gradient": "linear-gradient(#bce4f9, #63bff040)",
    "--bg-color-2": "hsl(209 50% 100%)",
    "--text-color": "#07124d",
    "--clr-heading": "#07124d",
  },
  green: {
    "--my-gradient": "linear-gradient(hsl(110, 27%, 96%), hsl(109 50% 90%))",
    "--bg-color-2": "hsl(109 50% 100%)",
    "--text-color": "hsl(111, 88%, 3%)",
    "--clr-heading": "hsl(111, 88%, 3%)",
  },
  dark: {
    "--my-gradient": "linear-gradient(hsl(248, 47%, 54%), hsl(240, 44%, 6%))",
    "--bg-color-2": "hsl(209 50% 5%)",
    "--text-color": "#f2e4e6",
    "--clr-heading": "#f2e4e6",
  },
};

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
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);

      const values = themeValues[theme] || themeValues["light-dark"];
      Object.entries(values).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    } catch {
      // ignore in non-browser environments
    }
  }, [theme]);

  async function handleThemeChange(nextTheme) {
    setTheme(nextTheme);

    try {
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem("theme", nextTheme);

      const values = themeValues[nextTheme] || themeValues["light-dark"];
      Object.entries(values).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
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
