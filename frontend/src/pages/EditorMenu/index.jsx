import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import * as saveLoad from "../../logic/saveLoad";
import { paths } from "../../index";
import { API_URL } from "../../utils/api.jsx";

export default function LevelListForEditor() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  useEffect(() => {
    // TODO : attention au double render !
    setLoading(true);

    fetch(`${API_URL}/api/myLevels/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((response) =>
      response
        .json()
        .then((data) => {
          //          console.log(data);
          setLevelListJSON(data.results);
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
            <Link to={paths.editLevel(level.id)}>
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
        <Link to={paths.editNewLevel()}>(Nouveau)</Link>
      </div>
    </div>
  );
}
