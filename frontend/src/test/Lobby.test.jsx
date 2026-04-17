import { render, screen } from "@testing-library/react";
import Lobby from "../pages/Lobby/index.jsx";

test("Affiche le message de bienvenue", () => {
  render(<Lobby />);

  expect(
    screen.getByText(/Bienvenue sur mon site du jeu "Place-to-be"./i),
  ).toBeInTheDocument();

  expect(screen.getByText(/J'espère qu'il vous plaîra./i)).toBeInTheDocument();
});
