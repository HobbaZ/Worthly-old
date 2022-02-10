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
      username
      email
      savedItems{ 
                  _id
                  purchasePrice
                  price
                  itemName
                  percent
                  profit
                  quantity
                  itemImages
                  purchasePrice
                  quantity
                }
  }
}
`;

export const EDIT_ITEM = gql`
mutation editItem($_id: ID) {
  editItem(_id: $_id) {
      _id
      username
      email
      savedItems{ 
                  _id
                  purchasePrice
                  price
                  itemName
                  percent
                  profit
                  quantity
                  itemImages
                  purchasePrice
                  quantity
                }
  }
}
`;

export const DELETE_ITEM = gql`
  mutation deleteItem($_id: ID) {
    deleteItem(_id: $_id) {
        _id
        username
        email
        savedItems{ 
                    _id
                    purchasePrice
                    price
                    itemName
                    percent
                    profit
                    quantity
                    itemImages
                    purchasePrice
                    quantity
                  }
    }
}
`;