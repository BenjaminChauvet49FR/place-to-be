import PlayMenu from "../pages/PlayMenu/index.jsx";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./utils.js";

test("Affichage liste niveaux", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          results: [
            { id: 1, name: "Niveau 1" },
            { id: 2, name: "Niveau 2" },
          ],
        }),
    }),
  );

  renderWithProviders(<PlayMenu />);

  expect(await screen.findByText("Niveau 1")).toBeInTheDocument();

  expect(await screen.findByText("Niveau 2")).toBeInTheDocument();

  /*const items = screen.getAllByRole("listitem");
  Utiliser Selenium pour les futurs tests sur la classe.
  */
});
