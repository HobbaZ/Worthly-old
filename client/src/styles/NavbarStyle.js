import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: rgb(92, 126, 170);
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 10px solid rgb(0, 62, 143);
`;

export const NavLink = styled(Link)`
  color: rgb(0, 0, 0);
  display: flex;
  align-items: center;
  margin: 0 auto;
  font-size: 35px;
  font-weight: 400;
  text-decoration: none;
  padding: 10px;
  cursor: pointer;

  :active {
    color: rgb(255, 255, 255);
  }

  :hover {
      color: rgb(189, 138, 0);
  }
`;

export const NavBtnLink = styled.button`
  align-items: center;
  width: 100px;
  background: rgba(255, 255, 255, 0);
  border: none;
  margin: 0 auto;
  font-size: 35px;
  font-weight: 400;
  text-decoration: none;
  padding: 10px;
  cursor: pointer;

  :active {
    color: rgb(255, 255, 255);
  }

  :hover {
      color: rgb(189, 138, 0);
  }
`;
  