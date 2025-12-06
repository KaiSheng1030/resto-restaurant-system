import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function Toast({ message, close }) {
  useEffect(() => {
    setTimeout(close, 7000);
  }, []);

  // Render directly to body using Portal to ensure fixed positioning works
  return ReactDOM.createPortal(
    <div className="toast" style={{
      position: 'fixed',
      right: '26px',
      bottom: '26px',
      zIndex: 99999
    }}>{message}</div>,
    document.body
  );
}
