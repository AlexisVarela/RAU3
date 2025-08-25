const express = require('express');
const router = express.Router();
const {getHome} = require('../controller/ControllerHome');

router.get('/', getHome);

module.exports = router;
