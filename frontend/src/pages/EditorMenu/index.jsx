import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import { deleteLevel, reorderLevels } from "../../utils/api.jsx";
import { paths } from "../../utils/paths.jsx";
import { gerPersonnalLevels } from "../../utils/api.jsx";

import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// Un élément draggable
function SortableItem({ id, value }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    backgroundColor: isDragging ? "#ffe082" : "",
    opacity: isDragging ? 0.9 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {value}
    </div>
  );
}

function findByLevelIndex(pList, pId) {
  for (var i = 0; i < pList.length; i++) {
    if (pId === pList[i].id) {
      return i;
    }
  }
  return -1;
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [levelListJSON, setLevelListJSON] = useState([]);

  // Note : Attention au double render !
  useEffect(() => {
    async function getLevels() {
      setLoading(true);
      const levelsData = await gerPersonnalLevels();
      if (levelsData.success) {
        setLevelListJSON(levelsData.levels);
      } else {
        window.alert("Echec du chargement des niveaux !"); // TODO une erreur plus détaillée !
        setLevelListJSON([]);
      }
      setLoading(false);
    }

    getLevels();
  }, []);

  function handleDelete(pLevelId, pUpdateLevelList) {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      deleteLevel(pLevelId)
        .then(() => {
          pUpdateLevelList((prev) => prev.filter((l) => l.id !== pLevelId));
        })
        .catch((error) => {
          console.error(error);
          alert("Echec de la suppression du niveau");
        });
    }
  }

  // ----------------------------------------------------->
  // Partie drag & drop
  const [dragMode, setDragMode] = useState(false);
  const [formerLevelsList, setFormerLevelsList] = useState(false);

  // Quand on lâche l'élément
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = findByLevelIndex(levelListJSON, active.id);
    const newIndex = findByLevelIndex(levelListJSON, over.id);

    setLevelListJSON(arrayMove(levelListJSON, oldIndex, newIndex));
  }

  // Bouton commencer, terminer, annuler
  function handleStartReorder() {
    setDragMode(true);
    setFormerLevelsList(levelListJSON);
  }

  function handleFinishReorder() {
    // console.log("Nouvel ordre :", levelListJSON);
    // Requete post par ici
    reorderLevels(levelListJSON.map((level) => level.id));
    setDragMode(false);
  }

  function handleCancelReorder() {
    setLevelListJSON(formerLevelsList.map((level) => level));
    setDragMode(false);
  }

  // ----------------------------------------------------->

  return (
    <div>
      {loading ? (
        <div>Chargement en cours</div>
      ) : dragMode ? (
        <>
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={levelListJSON}
              strategy={verticalListSortingStrategy}
            >
              <div className="level_list">
                {levelListJSON.map((item) => (
                  <SortableItem key={item.id} id={item.id} value={item.name} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <button onClick={handleFinishReorder}>Terminer</button>
          <button onClick={handleCancelReorder}>Annuler</button>
        </>
      ) : (
        <div className="level_list">
          {levelListJSON.map((level, key) => (
            <div key={`O${key}`}>
              <Link to={paths.editLevel(level.id)}>
                {level.name === "" ? "(anonyme)" : level.name}
              </Link>
              <span
                className="delete"
                onClick={() => handleDelete(level.id, setLevelListJSON)}
              >
                [Effacer]
              </span>{" "}
            </div>
          ))}
        </div>
      )}
      {dragMode ? null : (
        <>
          <div className="level_new">
            <Link to={paths.editLevelNew()}>(Nouveau)</Link>
          </div>
          <button onClick={() => handleStartReorder()}>
            Déplacer niveaux
          </button>{" "}
        </>
      )}
    </div>
  );
}
