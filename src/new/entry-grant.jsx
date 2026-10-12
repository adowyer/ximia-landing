import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import PageComponent from "./pages/grant.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PageComponent />
  </StrictMode>
);
