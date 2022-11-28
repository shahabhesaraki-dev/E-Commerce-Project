import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import { HomeContextProvider } from "./components/Context/HomeContext";

ReactDOM.render(
  <React.StrictMode>
    <HomeContextProvider>
      <App />
    </HomeContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
