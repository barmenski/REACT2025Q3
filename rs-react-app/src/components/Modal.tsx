import React from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modalBackground">
      <div className="modalActive">
        <button
          onClick={onClose}
          className="cross"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;