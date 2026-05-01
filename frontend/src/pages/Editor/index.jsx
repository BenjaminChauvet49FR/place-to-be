import EditorField from "../../components/EditorField";
import EditorPanel from "../../components/EditorPanel";
import { Error404 } from "../../utils/api.jsx";
import { useState, useEffect, useRef } from "react";
import { loadLevelFromID_CONNECTED, loadNewLevel } from "../../logic/saveLoad";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useContext } from "react";
import { LevelEditContext } from "../../context/LevelEditContext";
import { paths } from "../../utils/paths.jsx";

// -----------------------

export default function Page({ comeFromPlayTest }) {
  const { levelId } = useParams(); // Remember : same name as in router mandatory, or else... undefined !
  let trueLevelId = 0;
  if (levelId !== "new") {
    trueLevelId = parseInt(levelId);
  }

  const [loadedData, setLoadedData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const { state, dispatch } = useContext(LevelEditContext);

  const loadingPackage = {
    loadedData: loadedData,
    setLoadedData: setLoadedData,
    isLoading: isLoading,
    setLoading: setLoading,
    loadingError: loadingError,
    setLoadingError: setLoadingError,
  };

  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function init() {
      if (!location.state?.comeFromPlayTest) {
        dispatch({ type: "levelID", levelID: trueLevelId });

        hasFetched.current = true;
        setLoading(true);

        if (trueLevelId > 0) {
          try {
            await loadLevelFromID_CONNECTED(trueLevelId, dispatch);
          } catch (e) {
            if (e instanceof Error404) {
              navigate(paths.notFoundLevel());
            }
          } finally {
            setLoading(false);
          }
        } else {
          loadNewLevel(dispatch);
          setLoading(false);
        }
      } else {
        setLoading(false); // Note : isLoading is true by default
      }
    }
    init();
  }, [dispatch, trueLevelId, navigate, location.state?.comeFromPlayTest]);

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
