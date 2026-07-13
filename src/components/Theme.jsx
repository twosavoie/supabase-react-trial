import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

// * Why only local storage? Why not also use cookies? Because cookies are sent with every request, which is unnecessary for a theme. Local storage is only accessible on the client side, which is where the theme is applied. Cookies would be useful if we wanted to persist the theme across different devices or browsers, but for now, local storage is sufficient. (auto note...) Why not use a context provider for the theme? Because the theme is applied globally to the document root and body, and we don't need to pass it down through the component tree. Using a context provider would add unnecessary complexity. (auto note...)
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

// * Radio button colors are in the App.css file (starting at line ~942)
const themeValues = {
  // TODO: Add light dark CSS to "light-dark" theme.
  "light-dark": {
    "color-scheme": "light dark",
    "--bg-color-1": "light-dark(#ffffff, #15122f)",
    "--bg-color-2": "light-dark(#ffffff, #0c0828)",
    "--bg-color-3": "light-dark(#bce4f9, #0c0828)",
    "--bg-color-4": "light-dark(#f2fafe, #0c0828)",
    "--my-gradient":
      "linear-gradient(light-dark(#63bff005, hsl(248deg 45% 16%)), light-dark(#63bff040, hsl(240, 44%, 6%)))",
    "--text-color": "light-dark(#07124d, #f2e4e6)",
    "--text-color-disabled": "light-dark(#999999, #bbbbbb)",
    "--text-color-placeholder": "light-dark(#999999, #bbbbbb)",
    "--accent-color-1": "light-dark(#dc5a15, #f493a4)",
    "--accent-color-2": "light-dark(#f36500, #d7556c)",
    "--accent-color-2-hover": "light-dark(#ff6b00, #ed5e77)",
    "--accent-color-3": "light-dark(#09415e, #333)",
  },

  light: {
    "/* color-scheme */": "/* light dark */",
    "--bg-color-1": "#ffffff",
    "--bg-color-2": "#ffffff",
    "--bg-color-3": "#bce4f9",
    "--bg-color-4": "#f2fafe",
    "--my-gradient": "linear-gradient(#f6fbfd, #c1e4f9)",
    "--text-color": "#07124d",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#dc5a15",
    "--accent-color-2": "#f36500",
    "--accent-color-2-hover": "#ff6b00",
    "--accent-color-3": "#09415e",
  },

  pink: {
    "/* color-scheme */": "/* light dark */",
    "--bg-color-1": "#ffffff",
    "--bg-color-2": "#ffffff",
    "--bg-color-3": "#fcf6fb",
    "--bg-color-4": "#fcf6fb",
    "--my-gradient": "linear-gradient(#fcf6fb, hsl(310 50% 90%))",
    "--text-color": "#36454f",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#0d4d78",
    "--accent-color-2": "#0d4d78",
    "--accent-color-2-hover": "#1780c6",
    "--accent-color-3": "#0d4d78",
  },

  // TODO: Update names for themes
  blue: {
    // #eef0ef
    "/* color-scheme": "light dark */",
    "--bg-color-1": "#ffffff",
    "--bg-color-2": "#ffffff",
    "--bg-color-3": "#ffffff",
    "--bg-color-4": "#f5f4ef",
    "--my-gradient": "linear-gradient(#f5f4ef,  #ece7d2)",
    "--text-color": "#06213e",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#767e2a",
    "--accent-color-2": "#ac321f",
    "--accent-color-2-hover": "#862718",
    "--accent-color-3": "#e3a221",
  },

  green: {
    // Got7: #13b552 or #17bd3c or #3e733b #f4ced8 #f55258 #f487a4 #f7d841 #f4d23e #d7e43c #f4a6bb #ffff00 #ffff4e #ffff9d
    "/* color-scheme": "light dark */",
    "--bg-color-1": "#ffffff",
    "--bg-color-2": "#ffffff",
    "--bg-color-3": "#ffffff",
    "--bg-color-4": "#dff3df",
    "--my-gradient": "linear-gradient(#f6fef6, #90ed8a)",
    "--text-color": "#082506",
    "--text-color-disabled": "#999999",
    "--text-color-placeholder": "#999999",
    "--accent-color-1": "#f487a4",
    "--accent-color-2": "#ef517b",
    "--accent-color-2-hover": "#f487a4",
    "--accent-color-3": "#f17e9d",
  },

  dark: {
    "/* color-scheme": "light dark */",
    "--bg-color-1": "#15122f",
    "--bg-color-2": "#0c0828",
    "--bg-color-3": "#0c0828",
    "--bg-color-4": "#0c0828",
    "--my-gradient": "linear-gradient(#1b163a, #090918)",
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
  // TODO: Do I need remove and add? Does classList.add() automatically remove the previous class? I think it does, but I want to be sure. Should I just use classList.replace() instead? Or is it better to remove and add? I think it's better to remove and add, because if the class doesn't exist, then classList.replace() will throw an error. So it's safer to remove and add. (auto note...)
  root.classList.remove(
    "theme-light-dark",
    "theme-light",
    "theme-pink",
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
      "theme-pink",
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
      // * This is where the theme stored in the database is retrieved. If it exists, it will be used to set the selected theme. If not, the stored theme from local storage will be used. This ensures that the user's preferred theme is applied consistently across sessions and devices. (auto note...but also me)
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

  // ? Use fieldset? Have tried before unsuccessfully. Not passing WCAG May not be an issue when I move this to a select dropdown.
  // * Why am I not using event.target.value in the onChange handler? Because I want to directly pass the theme value to the updateProfile function, which will handle updating the state and persisting the theme. Using event.target.value would require an additional step to extract the value from the event object, which is unnecessary in this case. (auto note...)
  // ? use form here instead of in App.jsx file? Instead of label for "pick a color scheme" and then form wraps around the div "theme-color-picker__colors"
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

        <label htmlFor="pink" className="visually-hidden">
          Pink theme
        </label>
        <input
          type="radio"
          id="pink"
          name="theme"
          value="pink"
          checked={selectedTheme === "pink"}
          onChange={() => updateProfile("pink")}
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
