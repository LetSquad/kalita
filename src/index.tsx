import { createRoot } from "react-dom/client";

import "./styles/globals.scss";

import App from "./components/App";

createRoot(document.querySelector("#app") as Element).render((<App />));
