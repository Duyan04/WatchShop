import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import RouteApp from "./RouteApp";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteApp />
    </BrowserRouter>
  </React.StrictMode>
);
