import { forwardRef } from "react";
import PropTypes from "prop-types";

const Dialog = forwardRef(({ children, toggleDialog }, ref) => {
  Dialog.propTypes = {
    children: PropTypes.node.isRequired,
    toggleDialog: PropTypes.func.isRequired,
  };

  return (
    <dialog
      ref={ref}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          toggleDialog();
        }
      }}
    >
      <div className="dialog-content">
        {children}
        <button className="button" onClick={toggleDialog}>
          Close
        </button>
      </div>
    </dialog>
  );
});

Dialog.displayName = "Dialog";

export default Dialog;
