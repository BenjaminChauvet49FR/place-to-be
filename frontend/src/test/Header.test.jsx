import { screen } from "@testing-library/react";
import Header from "../components/Header.jsx";
import { renderWithProviders } from "./utils.js";

test("Affiche la bannière", () => {
  renderWithProviders(<Header />);

  expect(screen.getByText("Jouer")).toBeInTheDocument();
  expect(screen.getByText("Editer")).toBeInTheDocument();
  expect(screen.getByText("Nouvel utilisateur")).toBeInTheDocument();
});
