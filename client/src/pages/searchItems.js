import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';

import { SAVE_ITEM } from '../utils/mutations';

import { saveItemIds, getSavedItemIds } from '../utils/localStorage';

const apiKey = process.env.REACT_APP_API_KEY;

//Generate unique ids with crypto
const crypto = require("crypto");
const id = crypto.randomBytes(16).toString("hex");

//Use SerpApi ebay api
const SerpApi = require('google-search-results-nodejs');

const SearchItemsForm = () => {
    // create state for holding returned eBay api data
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
    } else {

    const search = new SerpApi.GoogleSearch(apiKey);

    try {
      const response = await fetch(`https://serpapi.com/search?engine=ebay&ebay_domain=ebay.com.au&_nkw=${searchInput}&source=nodejs&output=json&api_key=${apiKey}`)

      if (!response.ok) {
        console.log(response);
        throw new Error('something went wrong!');
      }

    if (!search) {
      console.log('Error occured trying to search');
    }
    
    //Has to match the name of one of the arrays in the response or it won't work
    const { organic_results } = await response.json();

    //find total price by adding all prices from the found records
    const averagePrice = () => {

    let total = 0;
    let average = 0;

    for (let index = 0; index < organic_results.length; index++) {
      let priceMinusPostage = organic_results[index].price.extracted - 9; //Guestimate of average postage
      total = total+priceMinusPostage;
    }

    average = (total/organic_results.length).toFixed(2);
    return (average);
    }

    const searchData = () => ({
      itemName: organic_results[0].title,
      itemId: id,
      quantity: organic_results.length,
      itemImages: organic_results[0].thumbnail || [],
      price: averagePrice(),

    })

    setSearcheditems(searchData);

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
  }
  };

  const handleSaveItem = async (itemId) => {

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

      {/* Results container */}
      <Container>
        <div>
        <h2>
          {searchedItems.quantity
            ? `${searchInput} / ${searchedItems.quantity} results`
            : 'Search for an item to begin'}
        </h2>

        <p>{searchedItems.itemName}</p>

        <div>  
        {searchedItems.itemImages ? (
                  <img src={searchedItems.itemImages} alt={`The default for ${searchInput}`} variant='top' />
                ) : null}
        </div>

        <p>
        {searchedItems.price
            ? `Estimated Sale Price (excl. postage): $${searchedItems.price}`
            : null}
        </p>

        {Auth.loggedIn() && (
                    <Button
                      disabled={savedItemIds?.some((savedItemId) => savedItemId === itemId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveItem(itemId)}>
                      {savedItemIds?.some((savedItemId) => savedItemId === itemId)
                        ? 'Already added!'
                        : 'Tracking'}
                    </Button>
        )}
        </div>
      </Container>
    </>
  );
};

export default SearchItemsForm;