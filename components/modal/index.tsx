import React from "react";


const Modal = ({ isOpen, onClose, children, right, transparant } : any) => {
  if (!isOpen) return null;

  return (
    <div className={right ?  'modalOverlayTop' :"modalOverlay"} onClick={onClose}>
      <div className={transparant ? 'modalContentTransparant':"modalContent"} onClick={(e) => e.stopPropagation()}>
        {/* <span className={"closeButton"} onClick={onClose}>
          &times;
        </span> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;