import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_ITEM } from '../utils/mutations';

import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap'; //migrate to Styled Components

import Auth from '../utils/auth';

const savedItems = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];

  //delete mutation
  const [ deleteItem ] = useMutation(DELETE_ITEM);

  // create function that accepts the item's mongo _id value deletes from the database
  const handleDeleteItem = async (itemId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //pass in user data object as argument, pass in itemId variable to deleteitem
      await deleteItem({
        variables: { itemId: itemId },
      })

    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Your Stuff!</h1>
        </Container>
      </Jumbotron>
      <Container>
 
        <CardColumns>
          {userData.savedItems.map((item) => {
            return (
              <Card key={item.itemId} border='dark'>
                {item.itemImages ? <Card.Img src={item.itemImages} alt={`Image for ${item.itemName}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{item.itemName}</Card.Title>
                  <p>Description: {item.description}</p>
                  <p>Purchase Price: {item.purchasePrice}</p>
                  <p>Average Sale Price: {item.averageSellingPrice}</p>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteItem(item.itemId)}>
                    Delete this item!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default savedItems;