export function mainQuestReducer(pState, pAction) {
  switch (pAction.type) {
    case "number":
      return {
        ...pState,
        number: pAction.number,
      };
    case "lastLevelNumber":
      return {
        ...pState,
        lastLevelNumber: pAction.lastLevelNumber,
      };
    default:
      console.log(
        "Erreur fatale : mauvaise utilisation de dispatch de mainQuestReducer ! (" +
          pAction.type +
          ")",
      );
      console.log(pAction);
      return 1 / 0;
  }
}

export const initialState = {
  number: 0,
  lastLevelNumber: 0,
};
