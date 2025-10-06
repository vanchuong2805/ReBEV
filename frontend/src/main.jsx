import React from "react"
import { createRoot } from "react-dom/client"
import { ApolloProvider } from "@apollo/client/react"
import client from "../client"
import AppRoutes from "./app/AppRoutes.jsx";
import "./assets/index.css"
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <ApolloProvider client={client}>
    <AppRoutes />
  </ApolloProvider>
</BrowserRouter>
)
