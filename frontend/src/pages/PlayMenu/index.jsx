import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import { paths } from "../../utils/paths.jsx";
import { getLevelsFreePlay } from "../../utils/api.jsx";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  // Note : attention au double render !
  useEffect(() => {
    async function getLevels() {
      setLoading(true);
      const levelsData = await getLevelsFreePlay();
      if (levelsData.success) {
        setLevelListJSON(levelsData.levels);
      } else {
        window.alert("Echec du chargement des niveaux !"); // TODO une erreur plus détaillée !
        setLevelListJSON([]);
      }
      setLoading(false);
    }

    getLevels();
  }, []);

  return (
    <div className="level_list">
      <div>--- Jouer à un niveau ---</div>

      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <div key={`O${key}`} role="listitem">
            <Link to={paths.playLevelFree(level.id)}>
              {level.name === "" ? "(anonyme)" : level.name}
            </Link>
            <span>{level.authorName}</span>
          </div>
        ))
      )}
    </div>
  );
}
