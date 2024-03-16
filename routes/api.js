const express = require('express');
const router = express.Router();

const menu = require('../controllers/api/menu');
const homePage = require('../controllers/api/home_page');
const member = require('../controllers/api/member');
const page = require('../controllers/api/page');
const eventList = require('../controllers/api/event_list');
const publication = require('../controllers/api/news_list');
const noticeList = require('../controllers/api/notice_list');
const jobList = require('../controllers/api/job_list');
const payment = require('../controllers/api/payment');
const donation = require("../controllers/api/donation");
const others = require("../controllers/api/others");
const gallery = require("../controllers/api/gallery");

router.get('/v1/gallery', function(req, res, next) {
  gallery.List(req, res, next);
});
router.get('/v1/batch_session_list', function(req, res, next) {
  others.batch_session_list(req, res, next);
});
router.get('/v1/occupation_list', function(req, res, next) {
  others.occupation_list_list(req, res, next);
});

router.get('/v1/scrolling_news_list', function(req, res, next) {
  publication.ScrollingNewsList(req, res, next);
});
router.get('/v1/category_list', function(req, res, next) {
  member.CategoryList(req, res, next);
});

router.get('/v1/payment', function(req, res, next) {
  payment.sslPayment(req, res, next);
});
router.get('/v1/job_list', function(req, res, next) {
  jobList.List(req, res, next);
});
router.get('/v1/notice_list', function(req, res, next) {
  noticeList.List(req, res, next);
});
router.get('/v1/member_list', function(req, res, next) {
  member.MemberList(req, res, next);
});

router.get('/v1/news_details/:id', function(req, res, next) {
  publication.NewsDetails(req, res, next);
});
router.get('/v1/publication', function(req, res, next) {
  publication.List(req, res, next);
});

router.get('/v1/event_details/:id', function(req, res, next) {
  eventList.Details(req, res, next);
});

router.post('/v1/event_register', function(req, res, next) {
  eventList.Save(req, res, next);
});
router.post('/v1/event_sponsor_register', function(req, res, next) {
  eventList.EventSponsorSave(req, res, next);
});

router.get('/v1/event_list', function(req, res, next) {
  eventList.List(req, res, next);
});

router.post('/v1/member_list_for_approved', function(req, res, next) {
  member.UserListForApproved(req, res, next);
});
// router.post('/v1/approved_list_for_user', function(req, res, next) {
//   member.ApprovedListForUser(req, res, next);
// });
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
router.post('/v1/member_register', member.Save);
router.post('/v1/donation_register', donation.Save);

router.get('/v1/home_page', function(req, res, next) {
  homePage.home_page(req, res, next);
});

router.get('/v1/menu_list', function(req, res, next) {
  menu.menu_list(req, res, next);
});

module.exports = router;
