import React from "react";
import ReactDOM from 'react-dom';
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from './stores/base'
import App from "./App";
import "./index.scss";

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app-root')
);
