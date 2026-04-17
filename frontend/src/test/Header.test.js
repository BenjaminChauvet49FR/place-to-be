import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import Header from "../components/Header";

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>,
  );
}

test("Affiche la bannière", () => {
  renderWithProviders(<Header />);

  expect(screen.getByText("Jouer")).toBeInTheDocument();
  expect(screen.getByText("Editer")).toBeInTheDocument();
  expect(screen.getByText("Nouvel utilisateur")).toBeInTheDocument();
});
