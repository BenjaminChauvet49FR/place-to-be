import { Link } from "react-router-dom";
import styled from "styled-components";
import "../styles/style.css";
import { paths } from "../index";

const StyledLink = styled(Link)`
  padding: 15px;
  color: #8186a0;
  text-decoration: none;
  font-size: 18px;
`;

function Header() {
  return (
    <nav>
      <StyledLink to={paths.levelList()}>Editeur</StyledLink>
    </nav>
  );
}

export default Header;
