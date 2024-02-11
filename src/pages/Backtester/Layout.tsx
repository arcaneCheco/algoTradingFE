import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";

export default () => {
  return (
    <>
      <Nav>
        <List>
          <li>
            <Link to="">main</Link>
          </li>
          <li>
            <Link to="batchTest">batch Test</Link>
          </li>
          <li>
            <Link to="savedTests">saved Tests</Link>
          </li>
        </List>
      </Nav>

      <Outlet />
    </>
  );
};

const Nav = styled.nav``;
const List = styled.ul`
  display: flex;
  width: 100%;
  gap: 30px;
  justify-content: center;
`;
