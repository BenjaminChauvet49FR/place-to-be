import { useContext, useEffect } from "react";
import { LevelEditContext } from "../../context/LevelEditContext";
import { useParams } from "react-router-dom";
import { loadLevelFromID_FREE } from "../../logic/saveLoad.jsx";
import Playing from "../../components/Playing.jsx";

export default function Page() {
  const uce = useContext(LevelEditContext);

  const { levelId } = useParams(); // Remember : same name as in router mandatory, or else... undefined !

  useEffect(() => {
    const trueLevelId = parseInt(levelId, 10);
    loadLevelFromID_FREE(trueLevelId, uce.dispatch);
  }, [levelId, uce.dispatch]);

  return <Playing />;
}
