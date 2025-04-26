// This is the main entry point for the Kitty Cones game, which contains the router.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import App from "./App";
import "@radix-ui/themes/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Theme 
      accentColor="indigo" 
      grayColor="mauve" 
      panelBackground="solid" 
      scaling="100%" 
      radius="large"
    >
      <App />
    </Theme>
  </BrowserRouter>
);