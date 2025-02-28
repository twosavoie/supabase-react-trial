import { forwardRef } from "react";
import PropTypes from "prop-types";

const Dialog = forwardRef(({ children, toggleDialog }, ref) => {
  Dialog.propTypes = {
    children: PropTypes.node.isRequired,
    toggleDialog: PropTypes.func.isRequired,
  };

  return (
    // TODO: Make it so that a user can't close the modal by clicking the padding inside.
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
        <button onClick={toggleDialog}>Close</button>
      </div>
    </dialog>
  );
});

Dialog.displayName = "Dialog";

export default Dialog;
