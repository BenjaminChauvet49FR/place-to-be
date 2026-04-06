import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import { paths } from "../../index";
import { API_URL } from "../../utils/api.jsx";

export default function LevelListForPlayer() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  useEffect(() => {
    // TODO : attention au double render !
    setLoading(true);

    fetch(`${API_URL}/api/levels/`, {
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
        .finally(setLoading(false)),
    );
  }, []);

  return (
    <div className="level_menu">
      <div>--- Jouer à un niveau ---</div>

      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <div key={`O${key}`}>
            <Link to={paths.playLevel(level.id)}>
              {level.name === "" ? "(anonyme)" : level.name}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
