import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadLevelFromID_FREE } from "../../logic/saveLoad.jsx";

import { LevelEditContext } from "../../context/LevelEditContext";
import Playing from "../../components/Playing.jsx";

import { paths } from "../../utils/paths.jsx";
import { Error404 } from "../../utils/api.jsx";

export default function Page() {
  const uce = useContext(LevelEditContext);

  const { levelId } = useParams(); // Remember : same name as in router mandatory, or else... undefined !

  const navigate = useNavigate();

  useEffect(() => {
    const trueLevelId = parseInt(levelId, 10);
    async function init() {
      try {
        await loadLevelFromID_FREE(trueLevelId, uce.dispatch);
      } catch (e) {
        if (typeof e == Error404) {
          navigate.redirect(paths.notFoundLevel());
        }
      }
    }
    init();
  }, [levelId, uce.dispatch, navigate]);

  return <Playing />;
}
