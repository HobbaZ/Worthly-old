import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';

import { SAVE_ITEM } from '../utils/mutations';

import { saveItemIds, getSavedItemIds } from '../utils/localStorage';

const apiKey = process.env.API_KEY;
const ebayApiRoute = process.env.EBAY_API;

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

      //third party API call here ebay api route with api key and add search query
    try {
      const response = await fetch(`${ebayApiRoute}${searchInput}`);

      if (!response.ok) {
        console.log(response);
        throw new Error('Error in linking to API!');
      }

      const { items } = await response.json();

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
      <div fluid className='text-light bg-dark'>
        <Container>
          <h1>Item Search!</h1>
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
              <Form.Label htmlFor='category'>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='item category'
                name='category'
                onChange={handleInputChange}
                value={searchInput.category}
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
              disabled={!(searchInput.keywords || searchInput.category || searchInput.itemName || searchInput.year)}
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