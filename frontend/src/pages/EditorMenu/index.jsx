import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";

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

  return (
    <div className="level_menu">
      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <div key={key}>
            <Link to={`/editLevel/${level.id}`}>
              {level.name === "" ? "(anonyme)" : level.name}
            </Link>
          </div>
        ))
      )}
      <div className="level_new">
        <Link to={`/editLevel/0`}>(Nouveau)</Link>
      </div>
    </div>
  );
}
