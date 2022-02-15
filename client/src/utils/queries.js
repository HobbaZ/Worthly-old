import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email

    }
  }
`;

/*export const GET_API = gql`
  query api() {
    api() {
      item
    }
  }
`*/

export const QUERY_ME = gql`
  query me {
    me {
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
