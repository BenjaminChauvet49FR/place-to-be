import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { useState, useEffect, useRef } from "react";
import { loadLevel, loadNewLevel } from "../../logic/saveLoad";
import { useParams } from "react-router-dom";

import { useContext } from "react";
import { LevelContext } from "../../context/LevelContext";

// -----------------------

export default function Editor() {
  const { levelId } = useParams(); // Remember : same name as in router mandatory, or else... undefined !
  let trueLevelId = 0;
  if (levelId !== "new") {
    trueLevelId = parseInt(levelId);
  }

  const [loadedData, setLoadedData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const { state, dispatch } = useContext(LevelContext);

  const loadingPackage = {
    loadedData: loadedData,
    setLoadedData: setLoadedData,
    isLoading: isLoading,
    setLoading: setLoading,
    loadingError: loadingError,
    setLoadingError: setLoadingError,
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    //if (hasFetched.current) return;
    dispatch({ type: "levelID", levelID: trueLevelId });

    hasFetched.current = true;
    setLoading(true);

    if (trueLevelId > 0) {
      try {
        loadLevel(trueLevelId, dispatch);
      } finally {
        setLoading(false);
      }
    } else {
      loadNewLevel(dispatch);
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <EditorField
        state={state}
        dispatch={dispatch}
        loadingPackage={loadingPackage}
      ></EditorField>
      <EditorPanel
        state={state}
        dispatch={dispatch}
        loadingPackage={loadingPackage}
      ></EditorPanel>
    </div>
  );
}
