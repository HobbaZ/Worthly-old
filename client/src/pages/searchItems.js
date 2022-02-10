import React, { useState, useEffect } from 'react';

import { Form, FormField, Label, FormGroup } from '../styles/FormStyle';

import { Button, Container, Image, TextBlock, ResultsContainer, ImageBlock } from '../styles/GenericStyles';

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';

import { SAVE_ITEM } from '../utils/mutations';

import { saveItemIds, getSavedItemIds } from '../utils/localStorage';

const apiKey = process.env.REACT_APP_API_KEY;

//Generate unique ids with crypto
//const crypto = require("crypto");
//const id = crypto.randomBytes(16).toString("hex");

//Use SerpApi ebay api
const SerpApi = require('google-search-results-nodejs');

const SearchItemsForm = () => {
    // create state for holding returned eBay api data
    const [searchedItems, setSearcheditems] = useState([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = useState({ itemName: '', userPaid: 0});
  
    // create state to hold saved itemId values
    const [savedItemIds, setsavedItemIds] = useState(getSavedItemIds());

    // Set up our mutation with an option to handle errors, put in parent form function
    const [saveItem ] = useMutation(SAVE_ITEM);
  
    // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    useEffect(() => {
      return () => saveItemIds(savedItemIds);
    });

    //Search form handler
    const handleInputChange = event => {
        const { name, value } = event.target;
        setSearchInput({ ...searchInput, [name]: value });
      };

    // create method to search for items and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    const search = new SerpApi.GoogleSearch(apiKey);

    try {
      const response = await fetch(`https://serpapi.com/search?engine=ebay&ebay_domain=ebay.com.au&_nkw=${searchInput.itemName}&source=nodejs&output=json&api_key=${apiKey}`)

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
      let priceMinusPostage = organic_results[index]?.price?.extracted - 9 || organic_results[index]?.shipping?.extracted - 15 || organic_results[index]?.price?.to?.extracted - 9  //Guestimate of average postage
      total = total+parseFloat(priceMinusPostage);

    }
    average = (total/organic_results.length).toFixed(2);    
    return average;
    };

    //Percentage function
    const percentage = () => {
      let ave = averagePrice()

      let percent = 0;

      //If price increase

      let difference = (ave - searchInput.userPaid)
      percent = ((difference/searchInput.userPaid)*100).toFixed(1);
      return percent
    };

    const profit = () => {
      let ave = averagePrice()
      let difference = (ave - searchInput.userPaid).toFixed(2)
      return difference;
    }

    const searchData = () => ({
      itemName: organic_results[0]?.title,
      quantity: organic_results.length,
      itemImages: organic_results[0]?.thumbnail || [],
      price: parseFloat(averagePrice()),
      purchasePrice: parseFloat(searchInput.userPaid),
      percent: parseFloat(percentage()),
      profit: parseFloat(profit()),
    })

      setSearcheditems(searchData);

      setSearchInput({
      //Reset all fields

      itemName: '',
      userPaid: 0,
    });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveItem = async () => {

    const itemToSave = {...searchedItems};

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveItem({
        variables: {item: itemToSave },
        
      });

      // if item successfully saves to user's account, save item to state

      setsavedItemIds([...savedItemIds, itemToSave.item]);
      console.log('item successfully saved', setsavedItemIds())

    } catch (err) {
      console.error(err);
    };
  };

  if (searchedItems.profit <= 0) {
    <p style={{color: 'red'}}></p>
  } else {
    <p style={{color: 'green'}}></p>
  }

return (
    <>
    <Container>
      <div>
          <h1>Search For Stuff!</h1>
              <h3>Search Tips...</h3>
              <p>Search for the item's brand and model number instead of vague search terms like colour and type of item</p>
      </div>

          <Form onSubmit={handleFormSubmit}>

            {/*Keyword Searchbar*/}

              <FormGroup>
              <Label>Item Name</Label>
              <FormField
                type='text'
                placeholder='Name of item'
                name='itemName'
                onChange={handleInputChange}
                value={searchInput.itemName}>
              </FormField>
              </FormGroup>
            
              <FormGroup>
              <Label>User Paid</Label>
              <FormField
                type='text'
                placeholder='Cost of Item'
                name='userPaid'
                onChange={handleInputChange}
                value={searchInput.userPaid}>
              </FormField>
              </FormGroup>

              <FormGroup>
            <Button
              disabled={!(searchInput.itemName || searchInput.userPaid)}
              type='submit'
              variant='success'>
              Submit
            </Button>
            </FormGroup>
          </Form>
      </Container>

      <ResultsContainer>
      {/* Results container */}

      <ImageBlock>  
        {searchedItems.itemImages ? (
                  <Image src={searchedItems.itemImages} alt={`The default for ${searchInput.itemName}`} variant='top'></Image>
                ) : null}
        </ImageBlock>

      <TextBlock>
      <h2>
      {searchedItems.itemName
      ?
      `${searchedItems.itemName}`
      : `No search results found`}
       </h2>

        <h4>
          {searchedItems.quantity
            ? 
            `${searchedItems.quantity} results`
            : null}
        </h4>

        <p>
          {searchedItems.purchasePrice
          ?
          `Purchase Price: ${searchedItems.purchasePrice}`
          : null}
        </p>

        <p>
        {searchedItems.price
            ? `Estimated Sale Price: $${searchedItems.price}`
            : null}
        </p>

        <p >
        {searchedItems.profit
            ? `Profit: ${searchedItems.profit <= 0 ? ' -' : ' +'} $${searchedItems.profit}  `
            : null}

        {searchedItems.percent
                  ? `(${searchedItems.percent <= 0 ?  ' ↓' : ' ↑'} ${searchedItems.percent}%)`
                  : null}</p>

        {Auth.loggedIn() && (
            <Button
            onClick={() => handleSaveItem()}>
              {/*Add local storage check for itemId*/}
                Track Item
            </Button>          
        )}
        </TextBlock>
        </ResultsContainer>
        
    </>
  );
};

export default SearchItemsForm;