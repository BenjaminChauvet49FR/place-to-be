import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadMainLevelFromNUMBER_CONNECTED } from "../../logic/saveLoad.jsx";

import { MainQuestContext } from "../../context/MainQuestContext.jsx";
import { LevelEditContext } from "../../context/LevelEditContext.jsx";
import Playing from "../../components/Playing.jsx";

import { paths } from "../../utils/paths.jsx";
import { Error404 } from "../../utils/api.jsx";

export default function Page() {
  const navigate = useNavigate();

  const uceDispatch = useContext(LevelEditContext).dispatch;
  const ucqDispatch = useContext(MainQuestContext).dispatch;

  const { levelNumber } = useParams(); // Remember : same name as in router mandatory, or else... undefined !

  useEffect(() => {
    const trueLevelNb = parseInt(levelNumber, 10);
    async function init() {
      try {
        await loadMainLevelFromNUMBER_CONNECTED(trueLevelNb, uceDispatch);
        ucqDispatch({ type: "number", number: trueLevelNb });
      } catch (e) {
        if (e instanceof Error404) {
          navigate(paths.notReachableLevelQuest());
          // TODO : faire pareil avec un niveau "non débloqué"
        }
      }
    }
    init();
  }, [levelNumber, uceDispatch, ucqDispatch, navigate]);

  return <Playing />;
}
