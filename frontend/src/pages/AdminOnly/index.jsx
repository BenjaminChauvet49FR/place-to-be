import { loadAllLevels } from "../../utils/api";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(); // Note : j'avais voulu tout faire sans useState... ça marche pas ;)
  const [dataLevels, setDataLevels] = useState([]);

  // let dataLevels; (Mauvaise idée !)

  useEffect(() => {
    async function init() {
      setLoading(true);
      //dataLevels = await loadAllLevels();
      setDataLevels(await loadAllLevels());
      setLoading(false);
    }
    init();
  }, []);

  return (
    <div>
      {" "}
      {loading ? (
        <div> Chargement en cours</div>
      ) : (
        <div>
          {dataLevels.map((lvl) => (
            <div key={lvl.id}>
              <div>
                {lvl.name} - {lvl.lvData}
              </div>
            </div>
          ))}{" "}
        </div>
      )}
    </div>
  );
}
