const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    savedItems: [Item]
  }

  input userInput {
    username: String
    email: String
  }

  input updateItem {
    itemImages: String
    purchasePrice: Float
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
  }

  type Item {
    _id: ID!
    itemImages: String!
    itemName: String!
    purchasePrice: Float!
    price: Float!
    profit: Float!
    quantity: Int!
    percent: Float!
  }

  input itemInput {
    itemImages: String
    itemName: String
    purchasePrice: Float
    price: Float
    percent: Float
    profit: Float
    quantity: Int
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth

    updateUser(user: userInput): User

    login(email: String!, password: String!): Auth

    saveItem(item: itemInput): User

    deleteItem(_id: ID): User 

    updateItem(_id: ID, item: updateItem): User 
  }
`;

module.exports = typeDefs;
