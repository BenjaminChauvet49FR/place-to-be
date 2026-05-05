import { useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadMainLevelFromNUMBER_CONNECTED } from "../../logic/saveLoad.jsx";

import { MainQuestContext } from "../../context/MainQuestContext.jsx";
import { LevelEditContext } from "../../context/LevelEditContext.jsx";
import { LevelPlayContext } from "../../context/LevelPlayContext.jsx";
import Playing from "../../components/Playing.jsx";

import { CLEAR } from "../../logic/constants.jsx";

import { paths } from "../../utils/paths.jsx";
import { attestMainQuestLevelSuccess, Error404 } from "../../utils/api.jsx";

export default function Page() {
  const navigate = useNavigate();

  const ucpState = useContext(LevelPlayContext).state;
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
        } else {
          window.alert(e.message);
        }
      }
    }
    init();
  }, [levelNumber, uceDispatch, ucqDispatch, navigate]);

  useEffect(() => {
    const trueLevelNb = parseInt(levelNumber, 10);

    if (ucpState.clear !== CLEAR.NO) {
      if (ucpState.clear === CLEAR.PARTIAL) {
        window.alert("Niveau réussi partiellement");
      }
      if (ucpState.clear === CLEAR.TOTAL) {
        window.alert("Niveau réussi totalement :)");
      }
      attestMainQuestLevelSuccess(trueLevelNb, ucpState.clear);
    }
  }, [ucpState.clear, levelNumber]); // Cf. "gameplay.jsx"

  return <Playing />;
}
