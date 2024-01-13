const express = require('express');
const router = express.Router();

const menu = require('../controllers/api/menu');
const homePage = require('../controllers/api/home_page');
const member = require('../controllers/api/member');

router.post('/v1/member_login', function(req, res, next) {
  member.Check(req, res, next);
});
router.post('/v1/member_register', function(req, res, next) {
  member.Save(req, res, next);
});

router.get('/v1/home_page', function(req, res, next) {
  homePage.home_page(req, res, next);
});

router.get('/v1/menu_list', function(req, res, next) {
  menu.menu_list(req, res, next);
});

module.exports = router;
