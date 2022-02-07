const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    networth: Float
    savedItems: [Item]
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
    itemId: String,
    description: String
    itemImages: [String]
    itemName: String
    purchasePrice: Float
    price: Float
    profit: Float
    quantity: Int
    saleQuantity: Int
    percent: Float
    postLinks: String
    highestSellingPrice: Int
    lowestSellingPrice: Int
    averageSellingPrice: Int
  }

  input itemInput {
    itemId: String
    description: String
    itemImages: [String]
    itemName: String
    purchasePrice: Float
    price: Float
    percent: Float
    profit: Float
    quantity: Int
    saleQuantity: Int
    postLinks: String
    highestSellingPrice: Int
    lowestSellingPrice: Int
    averageSellingPrice: Int
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    updateUser(username: String!, email: String!): Auth
    login(email: String!, password: String!): Auth
    saveItem(item: itemInput): User
    deleteItem(itemId: String!): User 
    updateItem(itemId: String!): User 
  }
`;

module.exports = typeDefs;
