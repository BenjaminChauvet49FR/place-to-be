import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div>
      {loading ? (
        <div>Chargement en cours</div>
      ) : (
        levelListJSON.map((level, key) => (
          <Link to={`/editLevel/${level.id}`} key={key}>
            {level.name === "" ? "(anonyme)" : level.name}
          </Link>
        ))
      )}
      <Link to={`/editLevel/0`}>(Nouveau)</Link>
    </div>
  );
}
