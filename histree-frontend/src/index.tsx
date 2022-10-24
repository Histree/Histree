import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import TreePage from "./pages/TreePage";

const container = document.getElementById("app-root")!;
const root = createRoot(container);
root.render(<TreePage />);
