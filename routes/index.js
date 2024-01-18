var express = require('express');
var router = express.Router();

const Login = require('../controllers/login/Login');
const Dashboard = require('../controllers/dashboard/Dashboard');
const PasswordChange = require('../controllers/password_change');
const Menu = require('../controllers/menu/Menu');
const SubMenu = require('../controllers/menu/SubMenu');
const HomePage = require('../controllers/home_page/HomePage');
const HomePageImage = require('../controllers/home_page/HomePageImage');
const Event = require('../controllers/event/Event');
const EventImage = require('../controllers/event/EventImage');
const Publication = require('../controllers/publication/Publication');
const EventSponsors = require('../controllers/event_sponsors/EventSponsors');
const DonationCareer = require('../controllers/donation_career/DonationCareer');
const NoticeBoard = require('../controllers/notice_board/NoticeBoard');
const Page = require('../controllers/page/Page');

function isLogin(req, res){
  if (req.session.user && req.cookies.MessengerPharmaAdminUser) {
    return true;
  }else{
    res.redirect('/login');
  }
}

router.get('/', function(req, res, next) {
  if (req.session.user && req.cookies.MessengerPharmaAdminUser) {
    res.redirect('/dashboard');
  }else{
    Login.login_view(req, res, next);
  }
});
router.get('/login', function(req, res, next) {
  if (req.session.user && req.cookies.MessengerPharmaAdminUser) {
    res.redirect('/dashboard');
  }else{
    Login.login_view(req, res, next);
  }
});
router.post('/login/login_from', Login.login_from);
router.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.MessengerPharmaAdminUser) {
    res.clearCookie('MessengerPharmaAdminUser');
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/change_password', function(req, res, next) {
  if (isLogin(req, res)) {
    PasswordChange.edit_from(req, res, next);
  }
});
router.post('/change_password/change', PasswordChange.edit);

router.get('/dashboard', function(req, res, next) {
  if (isLogin(req, res)) {
    Dashboard.data(req, res, next);
  }
});


router.get('/page', function(req, res, next) {
  if (isLogin(req, res)) {
    Page.list(req, res, next);
  }
});
router.post('/page/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Page.data_list(req, res, next);
  }
});
router.get('/page/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Page.add_from(req, res, next);
  }
});
router.post('/page/add', Page.add);
router.get('/page/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Page.edit_from(req, res, next);
  }
});
router.post('/page/edit/:id', Page.edit);
router.post('/page/del', function(req, res, next) {
  Page.delete(req, res, next);
});

//===============================================================

router.get('/menu/sub_menu', function(req, res, next) {
  if (isLogin(req, res)) {
    SubMenu.list(req, res, next);
  }
});
router.post('/menu/sub_menu/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    SubMenu.data_list(req, res, next);
  }
});
router.get('/menu/sub_menu/add', function(req, res, next) {
  if (isLogin(req, res)) {
    SubMenu.add_from(req, res, next);
  }
});
router.post('/menu/sub_menu/add', SubMenu.add);
router.get('/menu/sub_menu/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    SubMenu.edit_from(req, res, next);
  }
});
router.post('/menu/sub_menu/edit/:id', SubMenu.edit);
router.post('/menu/sub_menu/del', function(req, res, next) {
  SubMenu.delete(req, res, next);
});


//===============================================================
router.get('/menu', function(req, res, next) {
  if (isLogin(req, res)) {
    Menu.list(req, res, next);
  }
});
router.post('/menu/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Menu.data_list(req, res, next);
  }
});
router.get('/menu/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Menu.add_from(req, res, next);
  }
});
router.post('/menu/add', Menu.add);
router.get('/menu/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Menu.edit_from(req, res, next);
  }
});
router.post('/menu/edit/:id', Menu.edit);
router.post('/menu/del', function(req, res, next) {
  Menu.delete(req, res, next);
});


//===============================================================
router.get('/home_page', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePage.list(req, res, next);
  }
});
router.post('/home_page/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePage.data_list(req, res, next);
  }
});
router.get('/home_page/add', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePage.add_from(req, res, next);
  }
});
router.post('/home_page/add', HomePage.add);
router.get('/home_page/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePage.edit_from(req, res, next);
  }
});
router.post('/home_page/edit/:id', HomePage.edit);
router.post('/home_page/del', function(req, res, next) {
  HomePage.delete(req, res, next);
});
router.get('/home_page/media_list/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePageImage.media_list_add_from(req, res, next);
  }
});
router.post('/home_page/media_list/:id', HomePageImage.media_list_add);


//======================================================
router.get('/event', function(req, res, next) {
  if (isLogin(req, res)) {
    Event.list(req, res, next);
  }
});
router.post('/event/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Event.data_list(req, res, next);
  }
});
router.get('/event/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Event.add_from(req, res, next);
  }
});
router.post('/event/add', Event.add);
router.get('/event/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Event.edit_from(req, res, next);
  }
});
router.post('/event/edit/:id', Event.edit);
router.post('/event/del', function(req, res, next) {
  Event.delete(req, res, next);
});
router.get('/event/media_list/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    EventImage.media_list_add_from(req, res, next);
  }
});
router.post('/event/media_list/:id', EventImage.media_list_add);


router.get('/publication', function(req, res, next) {
  if (isLogin(req, res)) {
    Publication.list(req, res, next);
  }
});
router.post('/publication/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Publication.data_list(req, res, next);
  }
});
router.get('/publication/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Publication.add_from(req, res, next);
  }
});
router.post('/publication/add', Publication.add);
router.get('/publication/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Publication.edit_from(req, res, next);
  }
});
router.post('/publication/edit/:id', Publication.edit);
router.post('/publication/del', function(req, res, next) {
  Publication.delete(req, res, next);
});


//======================================================
router.get('/event_sponsors', function(req, res, next) {
  if (isLogin(req, res)) {
    EventSponsors.list(req, res, next);
  }
});
router.post('/event_sponsors/data-list', function(req, res, next) {
  if (isLogin(req, res)) {
    EventSponsors.data_list(req, res, next);
  }
});
router.get('/event_sponsors/add', function(req, res, next) {
  if (isLogin(req, res)) {
    EventSponsors.add_from(req, res, next);
  }
});
router.post('/event_sponsors/add', EventSponsors.add);
router.get('/event_sponsors/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    EventSponsors.edit_from(req, res, next);
  }
});
router.post('/event_sponsors/edit/:id', EventSponsors.edit);
router.post('/event_sponsors/del', function(req, res, next) {
  EventSponsors.delete(req, res, next);
});


//======================================================
router.get('/donation_career', function(req, res, next) {
  if (isLogin(req, res)) {
    DonationCareer.list(req, res, next);
  }
});
router.post('/donation_career/data-list', function(req, res, next) {
  if (isLogin(req, res)) {
    DonationCareer.data_list(req, res, next);
  }
});
router.get('/donation_career/add', function(req, res, next) {
  if (isLogin(req, res)) {
    DonationCareer.add_from(req, res, next);
  }
});
router.post('/donation_career/add', DonationCareer.add);
router.get('/donation_career/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    DonationCareer.edit_from(req, res, next);
  }
});
router.post('/donation_career/edit/:id', DonationCareer.edit);
router.post('/donation_career/del', function(req, res, next) {
  DonationCareer.delete(req, res, next);
});


//=========================
router.get('/notice_board', function(req, res, next) {
  if (isLogin(req, res)) {
    NoticeBoard.list(req, res, next);
  }
});
router.post('/notice_board/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    NoticeBoard.data_list(req, res, next);
  }
});
router.get('/notice_board/add', function(req, res, next) {
  if (isLogin(req, res)) {
    NoticeBoard.add_from(req, res, next);
  }
});
router.post('/notice_board/add', NoticeBoard.add);
router.get('/notice_board/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    NoticeBoard.edit_from(req, res, next);
  }
});
router.post('/notice_board/edit/:id', NoticeBoard.edit);
router.post('/notice_board/del', function(req, res, next) {
  NoticeBoard.delete(req, res, next);
});


module.exports = router;
