import React, { useState, useEffect } from "react";
import Studio from "./Studio";
import Home from "./Home/Home";
import "./App.css";

function applyMode(mode) {
  const html = document.documentElement;
  const body = document.body;

  // Remove both, then add the correct one
  html.classList.remove("mode-home", "mode-studio");
  body.classList.remove("mode-home", "mode-studio");
  html.classList.add(mode);
  body.classList.add(mode);

  // Always reset scroll position on page change
  window.scrollTo(0, 0);
}

export default function App() {
  const [page, setPage] = useState("home");

  // Apply on first render
  useEffect(() => {
    applyMode("mode-home");
  }, []);

  // Apply on every page change
  useEffect(() => {
    applyMode(page === "studio" ? "mode-studio" : "mode-home");
  }, [page]);

  if (page === "studio") {
    return <Studio />;
  }

  return <Home onEnterStudio={() => setPage("studio")} />;
}