import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, CardColumns } from 'react-bootstrap';

import Auth from '../utils/auth';

import { useMutation } from '@apollo/client';

import { SAVE_ITEM } from '../utils/mutations';

import { saveItemIds, getSavedItemIds } from '../utils/localStorage';

const apiKey = process.env.API_KEY;
const ebayApiRoute = process.env.EBAY_API;

const SearchItems = () => {
    // create state for holding returned eBay sold api data
    const [searchedBooks, setSearchedBooks] = useState([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = useState('');
  
    // create state to hold saved bookId values
    const [savedItemIds, setsavedItemIds] = useState(getSavedItemIds());
  
    // Set up our mutation with an option to handle errors, put in parent form function
    const [saveItem ] = useMutation(SAVE_ITEM);
  
    // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    useEffect(() => {
      return () => saveItemIds(savedItemIds);
    });

    // create method to search for items and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

      //third party API call here ebay api route with api key and add search query
    try {
      const response = await fetch(`${ebayApiRoute}${apiKey}${searchInput}`);

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

      setSearchedBooks(searchData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };
};
