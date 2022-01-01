const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../../controllers/userController.js');

//Get all users
router.route('/').get(getUsers).

//change to signup page?
router.route('/').post(createUser);

//Get a single user
router.route('/:userId').get(getUser);

//Delete a user
router.route('/:userId').delete(deleteUser);

//Update a user
router.route('/:userId').put(updateUser);

module.exports = router;