import { Link } from "react-router-dom";
import styled from "styled-components";
import "../styles/style.css";
import { paths } from "../utils/paths.jsx";
import NameForm from "./NameForm";

const StyledLink = styled(Link)`
  padding: 15px;
  color: #8186a0;
  text-decoration: none;
  font-size: 18px;
`;

export default function Component() {
  return (
    <nav>
      <StyledLink
        data-testid="link-mainQuestMenu"
        to={paths.levelListForMainQuest()}
      >
        Quête principale
      </StyledLink>
      <StyledLink data-testid="link-playMenu" to={paths.levelListForFreePlay()}>
        Jouer
      </StyledLink>
      <StyledLink data-testid="link-editLevel" to={paths.levelListForEditor()}>
        Editer
      </StyledLink>
      <StyledLink to={paths.newUser()}>Nouvel utilisateur</StyledLink>
      <NameForm></NameForm>
    </nav>
  );
}
