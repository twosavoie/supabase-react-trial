import { useState, useRef } from "react";
// import { supabase } from "../supabaseClient";
import Account from "./Account";
import About from "./About";
import PropTypes from "prop-types";
import Dialog from "./Dialog";

export default function Header({ session }) {
  const [dialogContent, setDialogContent] = useState(null);
  const dialogRef = useRef(null);

  Header.propTypes = {
    session: PropTypes.object.isRequired,
  };

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  return (
    <header className="header">
      {/* TODO: Maybe stack h1 and p */}
      <div className="header-logo">
        <h1>TiGu</h1>
        <p>Timer for GrownUps</p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
        }}
      >
        {/* TODO: Maybe replace "account" with user's image */}
        <button
          onClick={() => {
            setDialogContent(
              <Account key={session.user.id} session={session} />
            );
            toggleDialog();
          }}
        >
          Account
        </button>
        <button
          onClick={() => {
            setDialogContent(<About />);
            toggleDialog();
          }}
        >
          About
        </button>
        <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
          {dialogContent}
        </Dialog>
      </div>
    </header>
  );
}
