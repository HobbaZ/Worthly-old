import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_ITEM } from '../utils/mutations';

import { Button, Container, Image } from '../styles/GenericStyles';

import Auth from '../utils/auth';
import { removeItemId } from '../utils/localStorage';

const SavedItems = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];

  //delete mutation
  const [ deleteItem ] = useMutation(DELETE_ITEM);

  const content = JSON.parse(localStorage.getItem('saved_items'));

  console.log(content)

  console.log("Current records in db: ", content.length)

  // create function that accepts the item's id value deletes from the database
  const handleDeleteItem = async (itemId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //pass in user data object as argument, pass in itemId variable to deleteitem
      await deleteItem({
        variables: { item: itemId },
      })

      removeItemId(itemId);
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
    <Container>
      <div>
          <h1>Your Saved Stuff!</h1>
      </div>
      <div>
      <h2>
          {content?.length
            ? `Viewing ${content.length} saved ${content.length === 1 ? 'item' : 'items'}:`
            : 'You aren\'t tracking anything yet!'}
        </h2>
 
          {content?.map((item) => {
            return (
              <div key={item.itemId} border='dark'>
                {item.itemImages ? <Image src={item.itemImages} alt={`Image for ${item.itemName}`} variant='top'></Image> : null}
                  <h2>{item.itemName}</h2>
                  <p>Purchase Price: ${item.purchasePrice}</p>
                  <p>Average Sale Price: ${item.price}</p>
                  <p>{item.percent
                  ? `Percent Profit: ${item.percent <= 0 ? '-' : '+'} ${item.percent}`
                  : 'Error showing percent movement'}%</p>

                  <Button onClick={() => handleDeleteItem(item.itemId)}>
                    Delete
                  </Button>
              </div>
            );
          })}
      </div>
      </Container>
    </>
  );
};

export default SavedItems;