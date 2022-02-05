import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container } from '../styles/GenericStyles';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = () => {
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || {};
  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  //If no user, return to home
  if (!user?.username) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <div>
        <h2>{userParam ? `${user.username}'s` : 'Your'} Profile</h2>

        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
        {!userParam && (
          <div
            style={{ border: '1px dotted #1a1a1a' }}
          >
          </div>
        )}
        </div>
    </Container>
  );
};

export default Profile;
