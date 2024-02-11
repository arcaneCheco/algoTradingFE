import { Outlet, Link } from "react-router-dom";
import styled from "styled-components";

export const Layout = () => {
  return (
    <>
      <Nav>
        <List>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/botPerformance">botPerformance</Link>
          </li>
          <li>
            <Link to="/backtester">backtester</Link>
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
