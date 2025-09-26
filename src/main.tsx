import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DyslexiaProvider } from "./contexts/DyslexiaContext";

createRoot(document.getElementById("root")!).render(
  <DyslexiaProvider>
    <App />
  </DyslexiaProvider>
);
