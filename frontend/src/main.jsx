import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Load Gujarati fonts
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Gujarati:wght@400;600;700&family=Yatra+One&display=swap";
document.head.appendChild(link);

// Global reset
const style = document.createElement("style");
style.textContent = `* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Noto Sans Gujarati', sans-serif; background: #1a0a00; color: #fff8f0; }`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
