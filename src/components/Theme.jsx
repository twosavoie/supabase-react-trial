import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

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
    "--my-gradient": "linear-gradient(#63bff040, hsl(240, 44%, 6%))",
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
    "--my-gradient": "linear-gradient(#81a4f1, #2362eb)",
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
    "--my-gradient": "linear-gradient(#18ef6040, #0a622740)",
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
    "--my-gradient": "linear-gradient(#1818ec, #babaf2)",
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

export default function Theme({ session }) {
  const [selectedTheme, setSelectedTheme] = useState(() => getStoredTheme());

  Theme.propTypes = {
    session: PropTypes.object.isRequired,
    theme: PropTypes.string,
  };

  useEffect(() => {
    let ignore = false;

    async function getProfile() {
      if (!session?.user?.id) {
        return;
      }

      const storedTheme = getStoredTheme();
      if (storedTheme) {
        setSelectedTheme(storedTheme);
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("theme")
        .eq("id", session.user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data?.theme) {
          setSelectedTheme(data.theme);
          persistTheme(data.theme);
        }
      }
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  useEffect(() => {
    persistTheme(selectedTheme);
    applyTheme(selectedTheme);
  }, [selectedTheme]);

  async function updateProfile(theme) {
    if (!session?.user?.id) {
      return;
    }

    setSelectedTheme(theme);
    persistTheme(theme);
    applyTheme(theme);

    const updates = {
      id: session.user.id,
      theme,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (error) {
      alert(error.message);
    }
  }

  return (
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
          value="light-dark"
          checked={selectedTheme === "light-dark"}
          onChange={() => updateProfile("light-dark")}
        />

        <label htmlFor="light" className="visually-hidden">
          Light theme
        </label>
        <input
          type="radio"
          id="light"
          className="light"
          name="theme"
          value="light"
          checked={selectedTheme === "light"}
          onChange={() => updateProfile("light")}
        />

        <label htmlFor="blue" className="visually-hidden">
          Blue theme
        </label>
        <input
          type="radio"
          id="blue"
          name="theme"
          value="blue"
          checked={selectedTheme === "blue"}
          onChange={() => updateProfile("blue")}
        />

        <label htmlFor="green" className="visually-hidden">
          Green theme
        </label>
        <input
          type="radio"
          id="green"
          name="theme"
          value="green"
          checked={selectedTheme === "green"}
          onChange={() => updateProfile("green")}
        />

        <label htmlFor="dark" className="visually-hidden">
          Dark theme
        </label>
        <input
          type="radio"
          id="dark"
          name="theme"
          value="dark"
          checked={selectedTheme === "dark"}
          onChange={() => updateProfile("dark")}
        />
      </div>
    </div>
  );
}
