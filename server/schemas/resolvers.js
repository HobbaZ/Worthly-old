const { AuthenticationError } = require('apollo-server-express');
const { User} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("savedItems");
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedItems");
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
        throw new AuthenticationError('Incorrect password or email address entered');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password or email address entered');
      }

      const token = signToken(user);

      return { token, user };
    },

    //Update item if logged in
    updateItem: async (parent, args, context) => {

      if (context.user) {
        return await User.findOneAndUpdate(
            {_id: context.user._id},
            {$push: { savedItems: args.item}},
            { new: true})
            .then (result => {
                return{result}
            })
            .catch (err => {
                console.error(err)
            })
    }
    throw new AuthenticationError('Please login to update an item!');
    },

    //Save item if logged in
    saveItem: async (parent, args, context) => {
        if (context.user) {

          console.log("These are the arguments passed \n", args)
        return await User.findOneAndUpdate(
            {_id: context.user._id},
            {$push: { savedItems: args.item }},
            { new: true})
            .then (result => {
              console.log("This is the result", result)
          })
          .catch (err => {
              console.error(err)
          })   
        }
    throw new AuthenticationError('Please login to add an item!');
},

    // Delete item if logged in
    deleteItem: async (parent, itemId, context) => {
      if (context.user) {
      return await User.findOneAndUpdate(
          { _id: context.user._id},
          {$pull: { savedItems: {_id: itemId}}},
          { new: true});   
  }
  throw new AuthenticationError('Please login to delete a item!');
 },  
},
};

module.exports = resolvers;
