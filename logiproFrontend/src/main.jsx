// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Estilos base
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // opcional

// JS de Bootstrap (para dropdowns, modals, tooltips, etc.)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
