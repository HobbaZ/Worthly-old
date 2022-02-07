import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_ITEM } from '../utils/mutations';

import { Button, Container, Image, ResultsContainer, ImageBlock, TextBlock } from '../styles/GenericStyles';

import Auth from '../utils/auth';
import { removeItemId } from '../utils/localStorage';

const content = JSON.parse(localStorage.getItem('saved_items'));

  console.log(content)

const netWorth = () => {
  let total = 0;

  for (let index = 0; index < content.length; index++) {
    let calcProfit = content[index].profit;
    total = total+parseFloat(calcProfit);
  }
  
  return total.toFixed(2);
  };

const SavedItems = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];

  //delete mutation
  const [ deleteItem ] = useMutation(DELETE_ITEM);

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
        variables: { itemId: itemId },
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
              <ResultsContainer>
              <div key={item.itemId}></div>

              <ImageBlock> 
                {item.itemImages ? <Image src={item.itemImages} alt={`Image for ${item.itemName}`} variant='top'></Image> : null}
                </ImageBlock>

                <TextBlock>
                  <h2>{item.itemName}</h2>
                  <p>Purchase Price: ${item.purchasePrice}</p>
                  <p>Average Sale Price: ${item.price}</p>

                  <p > Profit:
                    {item.profit
                            ? `${item.profit <= 0 ? ' -' : ' +'} $${item.profit}  `
                            : null}

                  {item.percent
                            ? `(${item.percent <= 0 ?  ' ↓' : ' ↑'} ${item.percent}%)`
                            : null}</p>
                  
                  </TextBlock>

                  <Button onClick={() => handleDeleteItem()}>
                    Delete
                  </Button> 
              </ResultsContainer>
            );
          })}

            {/*Display net profit and loses*/}
            <Container>
                <h1> Total Stuff Networth</h1>
                <h4>${netWorth()}</h4>

            </Container>
      </div>
    </>
  );
};

export default SavedItems;