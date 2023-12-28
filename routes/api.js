const express = require('express');
const router = express.Router();

const menu = require('../controllers/api/menu');


router.get('/v1/menu_list', function(req, res, next) {
  menu.menu_list(req, res, next);
});

module.exports = router;
