import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { paths } from "./utils/paths.jsx";
import reportWebVitals from "./reportWebVitals";

import LevelEditProvider from "./context/LevelEditContext.jsx";
import LevelPlayProvider from "./context/LevelPlayContext.jsx";
import AuthProvider from "./context/AuthContext.jsx";

import PrivateRoute from "./PrivateRoute.jsx";

// Composants
import Header from "./components/Header.jsx";

// -- Pages
// misc
import Lobby from "./pages/Lobby/index.jsx";
import NewUser from "./pages/NewUser/index.jsx";
// Jeu libre
import PlayMenu from "./pages/PlayMenu/";
import PlayingFromFree from "./pages/Playing_FromFree/index.jsx";
// Quete principale
import MainQuestMenu from "./pages/MainQuestMenu/index.jsx";
import PlayingFromQuest from "./pages/Playing_FromQuest/index.jsx";
// Editeur
import EditorMenu from "./pages/EditorMenu/";
import Editor from "./pages/Editor/";
import PlayingFromEdit from "./pages/Playing_FromEdit/index.jsx";
// Non accessible
import NotFoundLevel from "./pages/NotFoundLevel/index.jsx";
import NotReachableLevelQuest from "./pages/NotReachableLevelQuest/index.jsx";

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
              {/*Pages nécessitant une connexion privée */}

              <Route element={<PrivateRoute />}>
                <Route
                  path={paths.levelListForEditor()}
                  element={<EditorMenu />}
                />
                <Route path={paths.editLevelRouter()} element={<Editor />} />
                <Route
                  path={paths.levelListForMainQuest()}
                  element={<MainQuestMenu />}
                />
                <Route
                  path={paths.playLevelQuestRouter()}
                  element={<PlayingFromQuest />}
                />
              </Route>

              {/*Pages de niveaux non trouves / accessibles */}

              <Route path={paths.notFoundLevel()} element={<NotFoundLevel />} />
              <Route
                path={paths.notReachableLevelQuest()}
                element={<NotReachableLevelQuest />}
              />

              {/* Misc */}

              <Route path={paths.newUser()} element={<NewUser />} />
              <Route path={paths.home()} element={<Lobby />} />

              {/*Edition */}

              <Route
                path={paths.editLevelPlaying()}
                element={<PlayingFromEdit />}
              />

              {/*Jeu libre */}

              <Route
                path={paths.levelListForFreePlay()}
                element={<PlayMenu />}
              />
              <Route
                path={paths.playLevelFreeRouter()}
                element={<PlayingFromFree />}
              />
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
