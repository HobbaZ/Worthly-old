import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_ITEM, EDIT_ITEM } from '../utils/mutations';

import { Button, Container, Image, ResultsContainer, ImageBlock, TextBlock } from '../styles/GenericStyles';

import Auth from '../utils/auth';
import { removeItemId } from '../utils/localStorage';

const content = JSON.parse(localStorage.getItem('saved_items'));

if (!content) {
  console.log('no content')
}

const SavedItems = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];

  //delete mutation
  const [ deleteItem ] = useMutation(DELETE_ITEM);

  //Edit mutation
  const [ updateItem ] = useMutation(EDIT_ITEM)

  const netWorth = () => {
    let total = 0;
  
    for (let index = 0; index < userData.savedItems.length; index++) {
      let calcProfit = userData.savedItems[index].profit;
      total = total+parseFloat(calcProfit);
    }
    
    return total.toFixed(2);
    };
  
    //Find highest and lowest profits in array
    const sort = () => {
      const sortArray = [];
  
      let loss = 0;
      let most = 0;
  
      for (let index = 0; index < userData.savedItems.length; index++) {
        let calcProfit = userData.savedItems[index].profit;
        sortArray.push(calcProfit);
        sortArray.sort(function(a, b){return a - b});
  
        most = Math.max(...sortArray)
  
        if (Math.min(...sortArray) <=0 ) {
          loss = Math.min(...sortArray)
        } else {
          loss = null;
        }
      }
      return [ most, loss ]
    };


  // create function that accepts the item's id value deletes from the database
  const handleDeleteItem = async (_id, index) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //pass in user data object as argument, pass in _Id variable to deleteitem
      await deleteItem({
        variables: { _id: _id},
      })

      console.log("item successfully deleted", _id)
      window.location.reload();

      //removeItemId(_id);
    } catch (err) {
      console.error("Error deleting item", err);
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
          {userData.savedItems?.length
            ? `Viewing ${userData.savedItems.length} saved ${userData.savedItems.length === 1 ? 'item' : 'items'}:`
            : 'You aren\'t tracking anything yet!'}
        </h2>
 
          {userData.savedItems?.map((item) => {
            return (
              <ResultsContainer>
              <div key={item._id}></div>

              <p>{item._id}</p>

              <ImageBlock> 
                {item.itemImages ? <Image src={item.itemImages} alt={`Image for ${item.itemName}`} variant='top'></Image> : null}
                </ImageBlock>

                <TextBlock>
                  <h2>{item.itemName}</h2>
                  <p>Purchase Price: ${item.purchasePrice}</p>

                  {/*Edit purchase price field here*/}

                  <p>Average Sale Price: ${item.price}</p>

                  <p >
                    {item.profit
                            ? `Profit: ${item.profit <= 0 ? ' -' : ' +'} $${item.profit}  `
                            : null}

                  {item.percent
                            ? `(${item.percent <= 0 ?  ' ↓' : ' ↑'} ${item.percent}%)`
                            : null}</p>
                  
                  </TextBlock>

                  <Button onClick={() => handleDeleteItem(item._id)}>
                    Delete
                  </Button> 
              </ResultsContainer>
            );
          })}

            {/*Display net profit and loses*/}
            <Container>
                <h1> Total Stuff Networth</h1>
                <h4>${netWorth()}</h4>

                <h5>Highest profit: ${sort()[0]}</h5>

                <h5>Highest loss: ${sort()[1]}</h5>

            </Container>
      </div>
    </>
  );
};

export default SavedItems;