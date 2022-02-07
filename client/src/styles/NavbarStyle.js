import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: rgb(92, 126, 170);
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px;
  margin-bottom: 10px;
  border-bottom: 2px solid black;

  @media (max-width: 400px) {
    flex-direction: column;
    justify-content: center;
  }
`;

export const NavLink = styled(Link)`
  color: rgb(0, 0, 0);
  align-items: center;
  margin: 0 auto;
  font-size: 20px;
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
  