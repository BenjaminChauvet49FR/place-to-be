import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import { paths } from "../../utils/paths.jsx";
import { API_URL, API_LEVEL_MAIN_QUEST } from "../../utils/api.jsx";

export default function MainQuestMenu() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  useEffect(() => {
    // TODO : attention au double render !
    setLoading(true);

    fetch(`${API_URL}/${API_LEVEL_MAIN_QUEST}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((response) =>
      response
        .json()
        .then((data) => {
          setLevelListJSON(data.results);
        })
        .catch((error) => {
          console.log(error);
          window.alert("Echec du chargement des niveaux !");
        })
        .finally(() => setLoading(false)),
    );
  }, []);

  return (
    <div className="level_list">
      <div>--- Quête principale ---</div>

      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <div key={`O${key}`} role="listitem">
            <span>{level.position} - </span>
            <Link to={paths.playLevelQuest(level.position)}>
              {level.name === "" ? "(anonyme)" : level.name}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
