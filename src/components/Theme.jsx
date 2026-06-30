import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

export default function Theme({ session }) {
  // const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("light-dark");

  Theme.propTypes = {
    session: PropTypes.object.isRequired,
    theme: PropTypes.string,
  };

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      // setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select(`theme`)
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setSelectedTheme(data.theme);
        }
      }

      // setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  async function updateProfile(theme) {
    const { user } = session;

    setSelectedTheme(theme);

    const updates = {
      id: user.id,
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
          defaultChecked={selectedTheme === "light-dark"}
          onChange={() => updateProfile("light-dark")}
        />

        <label htmlFor="light" className="visually-hidden">
          Light theme
        </label>
        <input
          type="radio"
          id="light"
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
