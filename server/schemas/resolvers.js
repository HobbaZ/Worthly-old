const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.findOne({ username });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },

    //Update item if logged in
    updateItem: async (parent, args, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
            {_id: context.User._id},
            {$push: { savedBooks: args}},
            { new: true})
            .then (result => {
                return{result}
            })
            .catch (err => {
                console.error(err)
            })
    }
    throw new AuthenticationError('Please login to add a book!');
    },

    //Save item if logged in
    saveItem: async (parent, args, context) => {
      if (context.user) {
        return await User.findOneAndUpdate(
            {_id: context.User._id},
            {$push: { savedItems: args}},
            { new: true})
            .then (result => {
                return{result}
            })
            .catch (err => {
                console.error(err)
            })
    }
    throw new AuthenticationError('Please login to add a book!');
    },

    // Delete item if logged in
    deleteItem: async (parent, {itemId}, context) => {
      if (context.user) {
      const user = await User.findOneAndUpdate(
          { _id: context.user._id},
          {$pull: { savedItems: {itemId}}},
          { new: true});
          return user;      
  }
  throw new AuthenticationError('Please login to delete a book!');
 },  
},
};

module.exports = resolvers;