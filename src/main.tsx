import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "./styles.css";
import "./dark-theme.css";
import "./experience.css";
import App from "./App";
import { ExperienceMotion } from "./components/ExperienceMotion";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ExperienceMotion>
      <App />
    </ExperienceMotion>
  </React.StrictMode>,
);
