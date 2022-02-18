import React from 'react';
import { NavLink, Nav, NavBtnLink } from '../styles/NavbarStyle'

import Auth from '../utils/auth';

const AppNavbar = () => {
  // set modal display state
  //const [showModal, setShowModal] = useState(false);

  return (
    <>
    {/*Show if user not logged in or logged in*/}
      <Nav>

          <NavLink to='/'>Worthly</NavLink>

          <NavLink to='/'>Search For Stuff</NavLink>

          {/*Only show if user logged in*/}
          {Auth.loggedIn() ? ( 
            <>
          <NavLink to='/saved-stuff'>Your Saved Stuff</NavLink>

          <NavLink to='/profile'>Your Profile</NavLink>
          
          <NavBtnLink onClick={Auth.logout}> Logout</NavBtnLink>
          </>
           ) : (
             <>
             {/*Show if user not logged in*/}
          <NavLink to='/login'>Login</NavLink>

          <NavLink to='/signup'>Sign Up</NavLink>
          </>
          )}        
      </Nav>
    </>
  );
};

export default AppNavbar;