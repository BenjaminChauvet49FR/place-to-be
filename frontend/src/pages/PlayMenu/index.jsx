import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import { paths } from "../../utils/paths.jsx";
import { API_URL, API_LEVELS_GENERAL_PUBLIC } from "../../utils/api.jsx";

export default function PlayMenu() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  useEffect(() => {
    // TODO : attention au double render !
    setLoading(true);

    fetch(`${API_URL}/${API_LEVELS_GENERAL_PUBLIC}/`, {
      headers: {},
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
        .finally(() => setLoading(false)),
    );
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
