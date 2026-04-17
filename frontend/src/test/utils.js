import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthProvider from "../context/AuthContext";
import LevelPlayProvider from "../context/LevelPlayContext";
import LevelEditProvider from "../context/LevelEditContext";

export function renderWithProviders(ui) {
  return render(
    <LevelEditProvider>
      <LevelPlayProvider>
        <MemoryRouter>
          <AuthProvider>{ui}</AuthProvider>
        </MemoryRouter>
      </LevelPlayProvider>
      ,
    </LevelEditProvider>,
  );
}
