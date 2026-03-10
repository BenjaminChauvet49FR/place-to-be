import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

import Playing from "./pages/Playing/index.jsx";
import EditorMenu from "./pages/EditorMenu/";
import Editor from "./pages/Editor/";
import LevelEditProvider from "./context/LevelEditContext.jsx";
import LevelPlayProvider from "./context/LevelPlayContext.jsx";

import Header from "./components/Header.jsx";

import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <LevelPlayProvider>
      <LevelEditProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/editor" element={<EditorMenu />} />
            <Route path="/editLevel/:levelId" element={<Editor />} />
            <Route path="/editLevel/playing" element={<Playing />} />
          </Routes>
        </Router>
      </LevelEditProvider>
    </LevelPlayProvider>
  </React.StrictMode>,
);

// TODO IDK if it's a good idea to expose level ID like that...
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
