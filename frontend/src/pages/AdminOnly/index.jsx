import { loadAllLevels } from "../../utils/api";
import { useEffect, useState } from "react";

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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
