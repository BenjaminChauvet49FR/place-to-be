import { loadAllLevels } from "../../utils/api";
import { useEffect, useState } from "react";
import { convertOldDataToNew, saveLevelADMIN } from "../../logic/saveLoad";

function handleEncodeAll(pDataLevels) {
  async function go() {
    let newData;
    let level;
    for (var i = 0; i < pDataLevels.length; i++) {
      level = pDataLevels[i];
      console.log("----");
      console.log(level.lvData);
      console.log("CONVERSION !");
      newData = convertOldDataToNew(level.lvData);
      console.log(newData);
      await saveLevelADMIN(newData, level.name, level.id);
    }
    window.location.reload();
  }
  go();
}

function editName(pLevel) {
  async function go() {
    let newName = prompt("Nouveau nom du niveau :", pLevel.name);
    if (newName !== null && newName !== "") {
      await saveLevelADMIN(pLevel.lvData, newName, pLevel.id);
    }
  }
  go();
}

function editData(pLevel) {
  async function go() {
    let newData = prompt(
      "Nouvelles données du niveau (stockées telles quelles, y compris les caractères comme * - attention aux corruptions) :",
      pLevel.lvData,
    );
    if (newData !== null && newData !== "") {
      await saveLevelADMIN(newData, pLevel.name, pLevel.id);
    }
  }
  go();
}

export default function Page() {
  const [loading, setLoading] = useState(); // Note : j'avais voulu tout faire sans useState... ça marche pas ;)
  const [dataLevels, setDataLevels] = useState([]);

  // Note rappel : dans le useEffect, obligation de passer par useState et, si appel API, par une fonction en await
  useEffect(() => {
    async function init() {
      setLoading(true);
      setDataLevels(await loadAllLevels());
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div>
      {loading ? (
        <div> Chargement en cours</div>
      ) : (
        <table>
          <tbody>
            {dataLevels.map((lvl) => (
              <tr key={lvl.id}>
                <td>{lvl.creator ? lvl.creator.username : null} </td>
                <td>|</td>
                <td>{lvl.name}</td>
                <td>|</td>
                <td>{lvl.lvData}</td>
                <td>
                  <button onClick={() => editName(lvl)}>Editer nom</button>
                  <button onClick={() => editData(lvl)}>Editer données</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => handleEncodeAll(dataLevels, setDataLevels)}>
        Changer l'encodage de TOUS les niveaux
      </button>
    </div>
  );
}
