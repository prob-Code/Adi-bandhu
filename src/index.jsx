import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

import { UiProvider } from './context/UiContext';
import { AuthProvider } from './context/AuthContext';

root.render(
  <UiProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </UiProvider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
