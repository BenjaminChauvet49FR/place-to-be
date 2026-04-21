import { useContext, useEffect } from "react";
import { LevelEditContext } from "../../context/LevelEditContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { loadMainLevelFromNUMBER_CONNECTED } from "../../logic/saveLoad.jsx";
import Error404 from "../../logic/Errors.js";
import Playing from "../../components/Playing.jsx";
import { paths } from "../../utils/paths.jsx";

export default function Page() {
  const navigate = useNavigate();

  const uce = useContext(LevelEditContext);

  const { levelNumber } = useParams(); // Remember : same name as in router mandatory, or else... undefined !

  useEffect(() => {
    const trueLevelNb = parseInt(levelNumber, 10);
    async function init() {
      try {
        await loadMainLevelFromNUMBER_CONNECTED(trueLevelNb, uce.dispatch);
      } catch (e) {
        if (e instanceof Error404) {
          navigate(paths.notReachableLevelQuest());
          // TODO : faire pareil avec un niveau "non débloqué"
        }
      }
    }
    init();
  }, [levelNumber, uce.dispatch]);

  return <Playing />;
}
