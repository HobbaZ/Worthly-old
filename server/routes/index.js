const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes.js');

router.use('/api', apiRoutes);
router.use('/homeRoutes', homeRoutes);

router.use((req, res) => res.send('Wrong route!'));

module.exports = router;