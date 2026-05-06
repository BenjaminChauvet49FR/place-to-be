import {
  SPACE,
  SPACE_INFO,
  BLOCK,
  BLOCK_INFO,
  DO_NOT_CHANGE,
  BLOCK_TYPES_LIST,
} from "../logic/constants.jsx";
import { deleteLevel /*loadAllLevels*/ } from "../utils/api.jsx";
import {
  saveLevel,
  //saveLevelEnMasse,
  //loadLevelFromID_ABSOLUTELY_ALL,
} from "../logic/saveLoad.jsx";

import { useAuth } from "../context/AuthContext.jsx";

import "../styles/style.css";
import { useNavigate } from "react-router-dom";
import { paths } from "../utils/paths.jsx";

export default function Component({ state, dispatch }) {
  function captionItemSelected(pSpace, pBlock) {
    //console.log("captionItemSelected : " + pSpace + pBlock); (great for debug)
    return (
      "case " +
      (pSpace !== DO_NOT_CHANGE ? SPACE_INFO[pSpace].captionEditor : ".") +
      "/ bloc " +
      (pBlock !== DO_NOT_CHANGE ? BLOCK_INFO[pBlock].captionEditor : ".")
    );
  }

  function selectSpace(pFixed) {
    dispatch({ type: "currentSpace", value: pFixed });
    if (pFixed === SPACE.WALL) {
      dispatch({ type: "currentBlock", value: BLOCK.NONE });
    } else {
      dispatch({ type: "currentBlock", value: DO_NOT_CHANGE });
    }
  }

  function selectBlock(pMobile) {
    if (state.currentSpace === SPACE.WALL) {
      dispatch({ type: "currentSpace", value: SPACE.EMPTY });
    } else {
      dispatch({ type: "currentSpace", value: DO_NOT_CHANGE });
    }
    dispatch({ type: "currentBlock", value: pMobile });
  }

  function emptySpace() {
    dispatch({ type: "currentSpace", value: SPACE.EMPTY });
    dispatch({ type: "currentBlock", value: BLOCK.NONE });
  }

  const navigate = useNavigate();
  function handleDeleteLevel() {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      deleteLevel(state.levelID)
        .then(() => {
          alert("Niveau correctement supprimé.");
          navigate(paths.levelListForEditor());
        })
        .catch((error) => {
          console.error(error);
          alert("Echec de la suppression du niveau");
        });
    }
  }

  function handleSaveLevel() {
    if (
      state.levelID === 0 ||
      window.confirm("Etes-vous certain de vouloir sauver ce niveau ?")
    ) {
      try {
        (async function () {
          await saveLevel(state, dispatch);
          alert("Niveau correctement sauvegardé.");
        })();
      } catch (error) {
        console.error(error);
        alert("Echec de la sauvegarde du niveau !");
      }
    }
  }

  function handlePlaytestLevel() {
    navigate(paths.editLevelPlaying());
  }

  function handleMovesChange(pBlockId, pValue) {
    dispatch({ type: "movesLimit", index: pBlockId, value: pValue });
  }

  function handleMovesSuperChange(pBlockId, pValue) {
    dispatch({ type: "movesSuperLimit", index: pBlockId, value: pValue });
    // Note : rien n'est fait si la super limite est supérieure à la limite ordinaire.
  }

  function handleInfiniteMovesChange(pBlockId, pValue) {
    dispatch({
      type: "movesInfinite",
      index: pBlockId,
      value: pValue,
    });
  }

  // =================================

  function handleLoadAndSaveALLLevels(pState, pDispatch) {
    /*try {
      (async function () {
        const data = await loadAllLevels();
        if (
          window.confirm(
            "Vous êtes sur le point de charger puis sauvegarder TOUS les niveaux ! (au nombre de " +
              data.length +
              ") : confirmer ?",
          )
        ) {
          data.forEach((entry) => {
            (async function () {
              await loadLevelFromID_ABSOLUTELY_ALL(entry.id, pDispatch); // from entry to dispatch
              // Note : changer l'ID n'est pas naturellement fait dans les fonctions "loadLevel", je dois donc le rajouter ici
              // Note : pour une raison que j'ignore, il est impossible de mettre l'ID du niveau en temps réel.
              // pDispatch({action : "levelID", levelID : entry.id})
              // Qu'à cela ne tienne, je force l'ID du niveau sauvegardé.
              saveLevelEnMasse(pState, pDispatch, entry.id);
            })();
          });
        }
      })();
    } catch (error) {
      console.error(error);
    }*/
    window.alert(
      "Bouton hors service ! La bascule d'encodage doit être faite manuellement, niveau par niveau. C'est pénible, je sais, mais on n'a pas le choix car la dernière fois que j'ai essayé, ça a transformé tous les niveaux en un seul !",
    );
  }

  // =================================

  const { user } = useAuth();

  return (
    <div className="mainComponent panel">
      <div>
        Actuellement sélectionné :{" "}
        {captionItemSelected(state.currentSpace, state.currentBlock)}
      </div>
      <div>
        <button onClick={() => selectSpace(SPACE.WALL)}>Mur</button>
        <button onClick={() => emptySpace()}>Case vide</button>
        <button onClick={() => selectSpace(SPACE.EMPTY)}>Aucune cible</button>
        <button onClick={() => selectBlock(BLOCK.NONE)}>Aucun bloc</button>
      </div>
      <div>
        {BLOCK_TYPES_LIST.map((type) => (
          <div key={type.cn}>
            <button
              className={`buttonSelection${type.cn}Light`}
              onClick={() => selectSpace(type.goal)}
            >
              Cible {type.goal}
            </button>
            <button
              className={`buttonSelection${type.cn}`}
              onClick={() => selectBlock(type.block)}
            >
              Bloc {type.block}
            </button>
            {"               "}
            <span className={"littleHelp"}>{"   "}Coups limites :</span>
            {"  "}
            <input
              className={`inputMoves ${type.cn}`}
              onChange={(e) => handleMovesChange(type.id, e.target.value)}
              disabled={
                state.movesInfinite[type.id] ? "disabled" : ""
              } /** Credits : https://stackoverflow.com/questions/36773671/deactivate-input-in-react-with-a-button-click */
              value={state.movesLimit[type.id]}
              min={0}
              max={99}
              type="number"
            ></input>
            {"     "}
            <span className={"littleHelp"}>Coups infinis : </span>
            <input
              type="checkbox"
              checked={state.movesInfinite[type.id]}
              onChange={(e) =>
                handleInfiniteMovesChange(type.id, e.target.checked)
              }
            />
            {"     "}

            <span className={"littleHelp"}>Super limite : </span>
            <input
              className={`inputMoves ${type.cn}`}
              min={0}
              max={999}
              type="number"
              value={state.movesSuperLimit[type.id]}
              onChange={(e) => handleMovesSuperChange(type.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      <br></br>
      <div>
        <input
          onChange={(e) =>
            dispatch({ type: "levelName", levelName: e.target.value })
          } // Credits : https://stackoverflow.com/questions/68473280/how-to-do-onchange-with-react-numeric-input
          value={state.levelName}
        />
        <button onClick={() => handleSaveLevel()}>Sauver niveau</button>
        {state.levelID > 0 && (
          <button className="delete" onClick={() => handleDeleteLevel()}>
            Effacer niveau
          </button>
        )}
      </div>
      <div>
        <button onClick={() => handlePlaytestLevel()}>Tester niveau</button>
      </div>
      {user.permissions.includes(
        "authentication.change_encoding_all_levels",
      ) && (
        <div>
          <button
            className="danger"
            onClick={() => handleLoadAndSaveALLLevels(state, dispatch)}
          >
            Charger et enregistrer TOUS les niveaux
          </button>
        </div>
      )}
    </div>
  );
}
