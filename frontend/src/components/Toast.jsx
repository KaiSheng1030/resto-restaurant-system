import React, { useEffect } from "react";

export default function Toast({ message, close }) {
  useEffect(() => {
    setTimeout(close, 2000);
  }, []);

  return (
    <div className="toast">{message}</div>
  );
}
