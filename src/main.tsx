import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppDataProvider } from "./AppDataContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppDataProvider
      children={<App />}
      >
    </AppDataProvider>
  </StrictMode>
);
