import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/style.css";
import * as saveLoad from "../../logic/saveLoad";
import { paths } from "../../utils/paths.jsx";
import { API_URL } from "../../utils/api.jsx";

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

  useEffect(() => {
    // Note : Attention au double render !
    setLoading(true);

    fetch(`${API_URL}/api/myLevels/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
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

  function deleteLevel(pLevelId, pUpdateLevelList) {
    if (window.confirm("Etes-vous certain de vouloir supprimer ce niveau ?")) {
      saveLoad
        .deleteLevel(pLevelId)
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
  function startReorder() {
    setDragMode(true);
    setFormerLevelsList(levelListJSON);
  }

  function finishReorder() {
    console.log("Nouvel ordre :", levelListJSON);
    // POST vers Django !
    saveLoad.reorderLevels(levelListJSON.map((level) => level.id));
    setDragMode(false);
  }

  function cancelReorder() {
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

          <button onClick={finishReorder}>Terminer</button>
          <button onClick={cancelReorder}>Annuler</button>
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
                onClick={() => deleteLevel(level.id, setLevelListJSON)}
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
          <button onClick={() => startReorder()}>Déplacer niveaux</button>{" "}
        </>
      )}
    </div>
  );
}
