import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  padding: 15px;
  color: #8186a0;
  text-decoration: none;
  font-size: 18px;
`;

function Header() {
  return (
    <nav>
      <StyledLink to="/">Jeu</StyledLink>
      <StyledLink to="/editor">Editeur</StyledLink>
    </nav>
  );
}

export default Header;
