// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Estilos base
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // opcional

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
