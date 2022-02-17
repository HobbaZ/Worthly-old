import React from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { DELETE_ITEM, UPDATE_ITEM } from '../utils/mutations';

import { Button, Container, Image, ResultsContainer, ImageBlock, TextBlock, ListText, ListBlock } from '../styles/GenericStyles';

//import { Form, FormField, Label, FormGroup } from '../styles/FormStyle';

import Auth from '../utils/auth';

const SavedItems = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || [];

  if (!userData) {
    window.location.replace("/")
  }

  //delete mutation
  const [ deleteItem ] = useMutation(DELETE_ITEM);

  //Edit mutation
  const [ updateItem ] = useMutation(UPDATE_ITEM)

 //Form Fields
  //const [itemUpdateInput, setItemUpdateInput] = useState({ itemImage: "", userPaid: 0});

  //Search form handler
  /*const handleInputChange = event => {
    const { name, value } = event.target;
    setItemUpdateInput({ ...itemUpdateInput, [name]: value });
  };*/

  /*const handleFormSubmit = async (event) => {
    event.preventDefault();

    
    if (!itemUpdateInput) {
      return false;
    }

    try {
      setItemUpdateInput({
        //Reset all fields
  
        itemImage: "",
        userPaid: "",
      });
      } catch (err) {
        console.error(err);
      }
    };*/

  //_____________NETWORTH CALCULATION_____________________

  //Calculate networth by adding all profits from the individual items listed
  const netWorth = () => {
    let total = 0;

    
  
    for (let index = 0; index < userData.savedItems?.length; index++) {
      let calcProfit = userData.savedItems[index].profit;
      total = total + parseFloat(calcProfit);
    }
    
    return total.toFixed(2);
    };
  
    //_____________HIGHEST/LOWEST VALUE ITEMS CALCULATION_____________________

    //Find highest and lowest profits in array
    const sort = () => {
      const sortArray = [];
  
      let loss = 0;
      let most = 0;
  
      for (let index = 0; index < userData.savedItems?.length; index++) {
        let calcProfit = userData.savedItems[index].profit;
        sortArray.push(calcProfit);
        sortArray.sort(function(a, b){return a - b});
  
        most = Math.max(...sortArray)
  
        if (Math.min(...sortArray) <=0 ) {
          loss = Math.min(...sortArray)
        } else {
          loss = 0;
        }
      }
      return [ most, loss ]
    };

  //_____________DELETE FUNCTION FOR DELETE BUTTON_____________________

  // Item's id value deletes from the database
  const handleDeleteItem = async (_id) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //pass in user data object as argument, pass in _Id variable to deleteitem
      await deleteItem({
        variables: { _id: _id},
      })

      console.log("item successfully deleted")
      window.location.reload();

      //removeItemId(_id);
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  //_____________UPDATE FUNCTION FOR EDIT BUTTON_____________________

  // Item's id value and updates from the database
  const handleUpdateItem = async (_id, item) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      //pass in user data object as argument, pass in _Id variable to updateitem
      await updateItem({
        variables: { _id: _id, item: item},
      })

      console.log("item successfully updated", _id, item)
      window.location.reload();

    } catch (err) {
      console.error("Error updating item", err);
    }
  };

  //_____________RENDERING STUFF_____________________

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

              <ImageBlock> 
                {item.itemImages ? <Image src={item.itemImages} alt={`Image for ${item.itemName}`} variant='top'></Image> : null}
                </ImageBlock>

                <TextBlock>
                  
                  <h2>{item.itemName}</h2>

                  <ListBlock>
                  <ListText>Purchase Price: ${item.purchasePrice}</ListText>

                  {/*Edit purchase price field here*/}
                  {/*<Form onSubmit={handleFormSubmit}>

                  <FormGroup>
                    <Label>Replace Price</Label>
                    <FormField
                      type='text'
                      placeholder= "Purchase Price"
                      name='userPaid'
                      onChange={handleInputChange}
                      value={itemUpdateInput.userPaid}>
                    </FormField>
                  </FormGroup>

                    <FormGroup>
                    <Label>Replace Item Image</Label>
                    <FormField
                      type='text'
                      placeholder= "Image path"
                      name='itemImage'
                      onChange={handleInputChange}
                      value={itemUpdateInput.itemImage}>
                    </FormField>
                  </FormGroup>
                  </Form>*/}

                  
                  <ListText>Average Sale Price: ${item.price}</ListText>

                  <ListText>Profit:

                  {item.profit
                            ? `${item.profit <= 0 ? ' -' : ' +'} $${item.profit}  `
                            : null}

                  {item.percent
                            ? `(${item.percent <= 0 ?  ' ↓' : ' ↑'} ${item.percent}%)`
                            : null}
                            
                            </ListText>
                  
                  </ListBlock>
                  </TextBlock>

                  <Button onClick={() => handleDeleteItem(item._id)}>
                    Delete
                  </Button> 

                  <Button onClick={() => handleUpdateItem(item._id)}>
                    Edit
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