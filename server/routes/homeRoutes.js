const router = require('express').Router();
const {
  login,
  logout,
  signup,
  contact,
} = require('../../controllers/userController.js');

//home route
router.route('/').get(login)

//Get all users
router.route('/').get(logout)

//Get all users
router.route('/').get(signup)

//Get all users
router.route('/').get(contact)

module.exports = router;