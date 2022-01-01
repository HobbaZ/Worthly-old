const User = require('../models/User');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.status(200).json({ message: 'Getting all users...', users}))
      .catch((err) => res.status(500).json({ message: 'Error with Getting All Users', err}));
  },

  // Get a single user
  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.status(200).json({ message: 'Found user...', user })
      )
      .catch((err) => res.status(500).json({ message: 'Error with Finding User', err}));
  },

  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.status(200).json({ message: 'Account Successfully Created', user}))
      .catch((err) => res.status(500).json({ message: 'Error with Creating Account', err}));
  },

  // Delete a user
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => res.status(200).json({ message: 'Account Successfully Deleted', user}))
      .catch((err) => res.status(500).json({ message: 'Error with Deleting Account', err}));
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that id!' })
          : res.status(200).json({ message: 'Account updated', user})
      )
      .catch((err) => res.status(500).json({ message: 'Error with Updating Account', err}));
  },
};