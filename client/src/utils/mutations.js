import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_ITEM = gql`
mutation saveItem($itemId: String!) {
  saveItem(itemId: $itemId) {
      _id
      username
      email
      savedItems{ 
                  itemId
                  itemName
                  description
                  itemImages
                  saleQuantity
                  postLinks
                  purchssePrice
                  quantity
                  averageSellingPrice
                  highestSellingPrice
                  lowestSellingPrice
                }
  }
}
`;

export const EDIT_ITEM = gql`
mutation editItem($itemId: String!) {
  editItem(itemId: $itemId) {
      _id
      username
      email
      savedItems{ 
                  itemId
                  itemName
                  description
                  itemImages
                  saleQuantity
                  postLinks
                  purchssePrice
                  quantity
                  averageSellingPrice
                  highestSellingPrice
                  lowestSellingPrice
                }
  }
}
`;

export const DELETE_ITEM = gql`
  mutation deleteItem($itemId: String!) {
    deleteItem(itemId: $itemId) {
        _id
        username
        email
        savedItems{ 
                    itemId
                    itemName
                    description
                    itemImages
                    saleQuantity
                    postLinks
                    purchssePrice
                    quantity
                    averageSellingPrice
                    highestSellingPrice
                    lowestSellingPrice
                  }
    }
  }
`;