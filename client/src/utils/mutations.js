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
mutation saveItem($item: itemInput!) {
  saveItem(item: $item) {
      _id
      savedItems{ 
                  itemId
                  purchasePrice
                  price
                  itemName
                  percent
                  description
                  itemImages
                  saleQuantity
                  postLinks
                  purchasePrice
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
      savedItems{ 
                  itemId
                  itemName
                  description
                  itemImages
                  saleQuantity
                  postLinks
                  purchasePrice
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
    deleteItem(item: $itemId) {
        _id
        savedItems{ 
                    itemId
                    itemName
                    description
                    itemImages
                    saleQuantity
                    postLinks
                    purchasePrice
                    quantity
                    averageSellingPrice
                    highestSellingPrice
                    lowestSellingPrice
                  }
    }
  }
`;