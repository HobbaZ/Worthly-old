import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';

import { SAVE_ITEM } from '../utils/mutations';

import { saveItemIds, getSavedItemIds } from '../utils/localStorage';

const apiKey = process.env.REACT_APP_API_KEY;


//Use SerpApi ebay api
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(apiKey);

const params = {
  engine: "ebay",
  ebay_domain: "ebay.com.au",
  _nkw: "Javascript Thau",
  _ipg: 200,
};

const callback = function(data) {

  //Only get shipping price, not actual sale price or sold price
  console.log(data['organic_results'])

  let resultData = data['organic_results'];

  //default image to show user
  let image = resultData[0].thumbnail;
  console.log(image)

  let totalPrice = 0;
  let averagePrice = 0;

  for (let index = 0; index < resultData.length; index++) {
    let priceMinusPostage = resultData[index].shipping.extracted - 9; //Guestimate of average postage
    totalPrice = totalPrice+priceMinusPostage;
  }

  averagePrice = (totalPrice/resultData.length).toFixed(2);

  return(console.log(`Total price is: $${totalPrice.toFixed(2)}, Average price is: $${averagePrice}, image to use: ${image}`));
};

 

// Show result as JSON
search.json(params, callback);



const SearchItemsForm = () => {
    // create state for holding returned eBay sold api data
    const [searchedItems, setSearcheditems] = useState([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = useState({keywords: '', category: '', year: '', itemName: '' });
  
    // create state to hold saved itemId values
    const [savedItemIds, setsavedItemIds] = useState(getSavedItemIds());

    // Set up our mutation with an option to handle errors, put in parent form function
    const [saveItem ] = useMutation(SAVE_ITEM);
  
    // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    useEffect(() => {
      return () => saveItemIds(savedItemIds);
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSearchInput({ ...searchInput, [name]: value });
      };

    // create method to search for items and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {

    const search = new SerpApi.GoogleSearch(apiKey);

    const params = {
      engine: "ebay",
      ebay_domain: "ebay.com.au",
      _nkw: `${searchInput}`,
      _ipg: 200,
    };
    
    const callback = function(data) {
    
      //Only get shipping price, not actual sale price or sold price
      console.log(data['organic_results'])
    
      let resultData = data['organic_results'];
    
      //default image to show user
      let image = resultData[0].thumbnail;
      console.log(image)
    
      let totalPrice = 0;
      let averagePrice = 0;
    
      for (let index = 0; index < resultData.length; index++) {
        let priceMinusPostage = resultData[index].price.extracted - 9; //Guestimate of average postage
        totalPrice = totalPrice+priceMinusPostage;
      }
    
      //Get average price by total Price / total number of records
      averagePrice = (totalPrice/resultData.length).toFixed(2);
    
      return(console.log(`Total price is: $${totalPrice.toFixed(2)}, total items: ${resultData.length}, Average price is: $${averagePrice}, image to use: ${image}`));
    };
    
    // Show result as JSON
    search.json(params, callback)
  
    











      //third party API call here serpapi api route with api key and add search query




      /*const { items } = await response.json();

      const searchData = items.map((item) => ({ //replace volumeInfo.field with response fields from api call
        authors: item.volumeInfo.authors || ['No author to display'],
        itemName: item.volumeInfo.title,
        saleQuantity: item.volumeInfo.description, //number of sales over a time period
        description: item.volumeInfo.description,
        postLinks: item.volumeInfo.description,
        highestSellingPrice: item.volumeInfo.description,
        lowestSellingPrice: item.volumeInfo.description,
        itemImages: item.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearcheditems(searchData);*/
      setSearchInput({
      //Reset all fields
      keywords: '',
      year: '',
      itemName: '',
      category: '',
    });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavedItem = async (itemId) => {

    const itemToSave = searchedItems.find((item) => item.itemId === itemId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveItem({
        variables: {item: itemToSave },
      });

      // if item successfully saves to user's account, save item id to state
      setsavedItemIds([...savedItemIds, itemToSave.itemId]);
    } catch (err) {
      console.error(err);
    };
  };

return (
    <>
      <div className='text-light bg-dark'>
        <Container>
          <h1>Search For Stuff!</h1>
          <div>
              <h3>Search Tips...</h3>
              <p>Search for the item's brand and model number instead of vague search terms like colour and type of item</p>
          </div>

          <Form onSubmit={handleFormSubmit}>

            {/*Keyword Searchbar*/}

            <Form.Group>
              <Form.Label htmlFor='itemName'>Item Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Name of item'
                name='itemName'
                onChange={handleInputChange}
                value={searchInput.itemName}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor='year'>Manufacture Year</Form.Label>
              <Form.Control
                type='text'
                placeholder='year of manufacture'
                name='year'
                onChange={handleInputChange}
                value={searchInput.year}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor='keywords'>Keywords</Form.Label>
              <Form.Control
                type='text'
                placeholder='item keywords'
                name='keywords'
                onChange={handleInputChange}
                value={searchInput.keywords}
              />
            </Form.Group>

            <Button
              disabled={!(searchInput.keywords || searchInput.itemName || searchInput.year)}
              type='submit'
              variant='success'>
              Submit
            </Button>
          </Form>
        </Container>
      </div>

      <Container>
        <div>
          {searchedItems.map((item) => {
            return (
              <Card key={item.itemId} border='dark'>
                {item.image ? (
                  <Card.Img src={item.image} alt={`Photo for ${item.title}`} variant='top' />
                ) : null}
                <Card.Body>
                <Card.Title>{item.itemName}</Card.Title>
                <p>Description: {item.description}</p>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedItemIds?.some((saveditemId) => saveditemId === item.itemId)}
                      className='btn-block btn-info'
                      onClick={() => handleSavedItem(item.itemId)}>
                      {savedItemIds?.some((saveditemId) => saveditemId === item.itemId)
                        ? 'This item has already been saved!'
                        : 'Save this item!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </Container>
    </>
  );
};

export default SearchItemsForm;