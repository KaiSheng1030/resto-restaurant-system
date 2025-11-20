import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setIsDark(saved === "dark");
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button className="theme-toggle-animated" onClick={toggle}>
      <div className={`toggle-track ${isDark ? "dark" : "light"}`}>
        <div className="toggle-thumb">
          {isDark ? "🌙" : "☀️"}
        </div>
      </div>
    </button>
  );
}
