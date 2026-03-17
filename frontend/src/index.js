import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";

import Playing from "./pages/Playing/index.jsx";
import EditorMenu from "./pages/EditorMenu/";
import Editor from "./pages/Editor/";
import LevelEditProvider from "./context/LevelEditContext.jsx";
import LevelPlayProvider from "./context/LevelPlayContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";

import Header from "./components/Header.jsx";

import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

export const paths = {
  editLevel: (id) => `/editLevel/${id}`,
  editNewLevel: () => `/editLevel/new`,
  levelList: () => `/editor`,
  playing: () => `/editLevel/playing`,
};
const privatePaths = {
  editLevelId: () => "/editLevel/:levelId",
};

root.render(
  <React.StrictMode>
    <LevelPlayProvider>
      <AuthProvider>
        <LevelEditProvider>
          <Router>
            <Header />
            <Routes>
              <Route path={paths.levelList()} element={<EditorMenu />} />
              <Route path={privatePaths.editLevelId()} element={<Editor />} />
              <Route path={paths.playing()} element={<Playing />} />
            </Routes>
          </Router>
        </LevelEditProvider>
      </AuthProvider>
    </LevelPlayProvider>
  </React.StrictMode>,
);

// TODO IDK if it's a good idea to expose level ID like that...
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
