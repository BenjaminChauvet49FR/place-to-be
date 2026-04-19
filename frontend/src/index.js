import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { paths } from "./utils/paths.jsx";

import PlayMenu from "./pages/PlayMenu/";
import MainQuestMenu from "./pages/MainQuestMenu/index.jsx";
import PlayingFromEdit from "./pages/Playing_FromEdit/index.jsx";
import PlayingFromFree from "./pages/Playing_FromFree/index.jsx";
import PlayingFromQuest from "./pages/Playing_FromQuest/index.jsx";
import Lobby from "./pages/Lobby/index.jsx";
import NoEditLevel from "./pages/NoEditLevel/index.jsx";
import NotFoundLevel from "./pages/NotFoundLevel/index.jsx";
import NoLevelQuest from "./pages/NoLevelQuest/index.jsx";

import EditorMenu from "./pages/EditorMenu/";
import Editor from "./pages/Editor/";
import LevelEditProvider from "./context/LevelEditContext.jsx";
import LevelPlayProvider from "./context/LevelPlayContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";

import NewUser from "./pages/NewUser/index.jsx";

import Header from "./components/Header.jsx";

import PrivateRoute from "./PrivateRoute.jsx";

import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <LevelPlayProvider>
      <AuthProvider>
        <LevelEditProvider>
          <Router>
            <Header />
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route
                  path={paths.levelListForEditor()}
                  element={<EditorMenu />}
                />
                <Route path={paths.editLevelId()} element={<Editor />} />
                <Route
                  path={paths.levelListForMainQuest()}
                  element={<MainQuestMenu />}
                />
              </Route>

              <Route path={paths.noEditLevel()} element={<NoEditLevel />} />
              <Route path={paths.notFoundLevel()} element={<NotFoundLevel />} />
              <Route path={paths.noLevelQuest()} element={<NoLevelQuest />} />

              <Route path={paths.playing()} element={<PlayingFromEdit />} />

              <Route path={paths.levelListForPlay()} element={<PlayMenu />} />
              <Route path={paths.playLevelId()} element={<PlayingFromFree />} />
              <Route
                path={paths.playLevelQuestNumber()}
                element={<PlayingFromQuest />}
              />
              <Route path={paths.newUser()} element={<NewUser />} />
              <Route path={paths.home()} element={<Lobby />} />
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
