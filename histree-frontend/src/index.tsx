import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from './stores/base'
import App from "./App";
import "./index.scss";

const container = document.getElementById("app-root")!;
const root = createRoot(container);
root.render(
	<Provider store={store}>
		<App />
	</Provider>);
