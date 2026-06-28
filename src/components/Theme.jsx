// import { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
import PropTypes from "prop-types";

export default function Theme({ session }) {
  return (
    <div className="theme-color-picker account-form-widget-elements">
      <label>Pick a color scheme</label>
      <div className="theme-color-picker__colors">
        <label htmlFor="light-dark" className="visually-hidden">
          Light-Dark theme
        </label>
        <input type="radio" name="theme" id="light-dark" checked />

        <label htmlFor="light" className="visually-hidden">
          Light theme
        </label>
        <input type="radio" id="light" name="theme" />

        <label htmlFor="blue" className="visually-hidden">
          Blue theme
        </label>
        <input type="radio" id="blue" name="theme" />

        <label htmlFor="green" className="visually-hidden">
          Green theme
        </label>
        <input type="radio" id="green" name="theme" />

        <label htmlFor="dark" className="visually-hidden">
          Dark theme
        </label>
        <input type="radio" id="dark" name="theme" />
      </div>
    </div>
  );
  Theme.propTypes = {
    session: PropTypes.object,
  };
}
