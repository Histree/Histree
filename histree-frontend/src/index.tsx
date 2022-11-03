import React from "react";
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from './stores/base'
import App from "./App";
import "./index.scss";
const root = createRoot(document.getElementById("app-root") as HTMLElement);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);