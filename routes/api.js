const express = require('express');
const router = express.Router();

const menu = require('../controllers/api/menu');
const homePage = require('../controllers/api/home_page');
const member = require('../controllers/api/member');
const page = require('../controllers/api/page');
const eventList = require('../controllers/api/event_list');

router.post('/v1/event_register', function(req, res, next) {
  eventList.Save(req, res, next);
});

router.get('/v1/event_list', function(req, res, next) {
  eventList.List(req, res, next);
});

router.post('/v1/member_list_for_approved', function(req, res, next) {
  member.UserListForApproved(req, res, next);
});
router.get('/v1/user_details/:user_id', function(req, res, next) {
  member.UserDetails(req, res, next);
});
router.post('/v1/member_approved', function(req, res, next) {
  member.SaveMemberApproved(req, res, next);
});
router.post('/v1/page_details', function(req, res, next) {
  page.pageDetails(req, res, next);
});

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
