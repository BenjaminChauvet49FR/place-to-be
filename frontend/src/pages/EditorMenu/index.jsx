import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import * as saveLoad from "../../logic/saveLoad";

export default function LevelListForEditor() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  useEffect(() => {
    // TODO : attention au double render !
    setLoading(true);

    fetch(`http://localhost:8000/api/level/`).then((response) =>
      response
        .json()
        .then((data) => {
          //          console.log(data);
          setLevelListJSON(data);
        })
        .catch((error) => {
          console.log(error);
          window.alert("Echec du chargement des niveaux !");
        })
        .finally(setLoading(false)),
    );
  }, []);

  function deleteLevel(pLevelId, pUpdateLevelList) {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      saveLoad
        .deleteLevel(pLevelId)
        .then(() => {
          pUpdateLevelList((prev) => prev.filter((l) => l.id !== pLevelId));
        })
        .catch((error) => {
          console.error(error);
          alert("Echec de la suppression du niveau");
        });
    }
  }

  return (
    <div className="level_menu">
      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <div key={`O${key}`}>
            <Link to={`/editLevel/${level.id}`}>
              {level.name === "" ? "(anonyme)" : level.name}
            </Link>
            <span
              className="delete"
              onClick={() => deleteLevel(level.id, setLevelListJSON)}
            >
              [Effacer]
            </span>
          </div>
        ))
      )}
      <div className="level_new">
        <Link to={`/editLevel/new`}>(Nouveau)</Link>
      </div>
    </div>
  );
}
