import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import { paths } from "../../utils/paths.jsx";
import { getMainQuestLevels } from "../../utils/api.jsx";
import validation1 from "../../images/validation_1.png";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  // Note : Attention au double render !
  useEffect(() => {
    async function getLevels() {
      setLoading(true);
      const levelsData = await getMainQuestLevels();
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
    <div className="level_list_mq">
      <div>--- Quête principale ---</div>

      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <div
            key={`O${key}`}
            role="listitem"
            className={level.completionStatus ? "completed" : "uncompleted"}
          >
            <span>{level.position} - </span>
            <Link to={paths.playLevelQuest(level.position)}>
              {level.name === "" ? "(anonyme)" : level.name}
            </Link>
            {level.completionStatus && (
              <img
                src={validation1}
                alt="partiel"
                style={{
                  width: "16px",
                  height: "16px",
                  verticalAlign: "middle",
                }}
              ></img>
            )}
          </div>
        ))
      )}
    </div>
  );
}
