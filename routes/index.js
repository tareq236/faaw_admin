var express = require('express');
const Excel = require('exceljs');
const {MemberModel} = require("../models");
const multer = require('multer');
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
const Member = require('../controllers/member/Member');
const BatchSession = require('../controllers/batch_session/BatchSession');
const Occupation = require('../controllers/occupation/Occupation');
const Job = require('../controllers/job/Job');
const ScrollingNews = require('../controllers/scrolling_news/ScrollingNews');
const Category = require('../controllers/category/Category');
const Designation = require('../controllers/designation/Designation');
const Committee = require('../controllers/committee/Committee');
const AssignCommittee = require('../controllers/assign_committee/AssignCommittee');
const Donate = require('../controllers/donate_list/Donate');
const Gallery = require('../controllers/gallery/Gallery');
const Contacts = require('../controllers/contacts/Contacts');
const HomeSlider = require('../controllers/home_slider/HomeSlider');
const HomePopup = require('../controllers/home_popup/HomePopup');
const AboutUsMessage = require('../controllers/about_us_message/AboutUsMessage');
const Payment = require("../controllers/payment");
const Programs = require("../controllers/programs/Programs");

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



router.get('/donate_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Donate.list(req, res, next);
  }
});
router.post('/donate_list/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Donate.data_list(req, res, next);
  }
});



router.get('/committee/assign_committee', function(req, res, next) {
  if (isLogin(req, res)) {
    AssignCommittee.list(req, res, next);
  }
});
router.post('/committee/assign_committee/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    AssignCommittee.data_list(req, res, next);
  }
});
router.get('/committee/assign_committee/add', function(req, res, next) {
  if (isLogin(req, res)) {
    AssignCommittee.add_from(req, res, next);
  }
});
router.post('/committee/assign_committee/add', Committee.add);

router.get('/contacts', function(req, res, next) {
  if (isLogin(req, res)) {
    Contacts.list(req, res, next);
  }
});
router.post('/contacts/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Contacts.data_list(req, res, next);
  }
});
router.post('/contacts/del', function(req, res, next) {
  Contacts.delete(req, res, next);
});


router.get('/about_us_message', function(req, res, next) {
  if (isLogin(req, res)) {
    AboutUsMessage.list(req, res, next);
  }
});
router.post('/about_us_message/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    AboutUsMessage.data_list(req, res, next);
  }
});
router.get('/about_us_message/add', function(req, res, next) {
  if (isLogin(req, res)) {
    AboutUsMessage.add_from(req, res, next);
  }
});
router.post('/about_us_message/add', AboutUsMessage.add);
router.get('/about_us_message/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    AboutUsMessage.edit_from(req, res, next);
  }
});
router.post('/about_us_message/edit/:id', AboutUsMessage.edit);
router.post('/about_us_message/del', function(req, res, next) {
  AboutUsMessage.delete(req, res, next);
});


router.get('/home_popup', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePopup.list(req, res, next);
  }
});
router.post('/home_popup/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePopup.data_list(req, res, next);
  }
});
router.get('/home_popup/add', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePopup.add_from(req, res, next);
  }
});
router.post('/home_popup/add', HomePopup.add);
router.get('/home_popup/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    HomePopup.edit_from(req, res, next);
  }
});
router.post('/home_popup/edit/:id', HomePopup.edit);
router.post('/home_popup/del', function(req, res, next) {
  HomePopup.delete(req, res, next);
});


router.get('/home_slider', function(req, res, next) {
  if (isLogin(req, res)) {
    HomeSlider.list(req, res, next);
  }
});
router.post('/home_slider/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    HomeSlider.data_list(req, res, next);
  }
});
router.get('/home_slider/add', function(req, res, next) {
  if (isLogin(req, res)) {
    HomeSlider.add_from(req, res, next);
  }
});
router.post('/home_slider/add', HomeSlider.add);
router.get('/home_slider/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    HomeSlider.edit_from(req, res, next);
  }
});
router.post('/home_slider/edit/:id', HomeSlider.edit);
router.post('/home_slider/del', function(req, res, next) {
  HomeSlider.delete(req, res, next);
});


router.get('/gallery', function(req, res, next) {
  if (isLogin(req, res)) {
    Gallery.list(req, res, next);
  }
});
router.post('/gallery/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Gallery.data_list(req, res, next);
  }
});
router.get('/gallery/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Gallery.add_from(req, res, next);
  }
});
router.post('/gallery/add', Gallery.add);
router.get('/gallery/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Gallery.edit_from(req, res, next);
  }
});
router.post('/gallery/edit/:id', Gallery.edit);
router.post('/gallery/del', function(req, res, next) {
  Gallery.delete(req, res, next);
});



router.get('/committee', function(req, res, next) {
  if (isLogin(req, res)) {
    Committee.list(req, res, next);
  }
});
router.post('/committee/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Committee.data_list(req, res, next);
  }
});
router.get('/committee/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Committee.add_from(req, res, next);
  }
});
router.post('/committee/add', Committee.add);
router.get('/committee/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Committee.edit_from(req, res, next);
  }
});
router.post('/committee/edit/:id', Committee.edit);
router.post('/committee/del', function(req, res, next) {
  Committee.delete(req, res, next);
});


router.get('/designation', function(req, res, next) {
  if (isLogin(req, res)) {
    Designation.list(req, res, next);
  }
});
router.post('/designation/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Designation.data_list(req, res, next);
  }
});
router.get('/designation/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Designation.add_from(req, res, next);
  }
});
router.post('/designation/add', Designation.add);
router.get('/designation/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Designation.edit_from(req, res, next);
  }
});
router.post('/designation/edit/:id', Designation.edit);
router.post('/designation/del', function(req, res, next) {
  Designation.delete(req, res, next);
});


router.get('/category', function(req, res, next) {
  if (isLogin(req, res)) {
    Category.list(req, res, next);
  }
});
router.post('/category/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Category.data_list(req, res, next);
  }
});
router.get('/category/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Category.add_from(req, res, next);
  }
});
router.post('/category/add', Category.add);
router.get('/category/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Category.edit_from(req, res, next);
  }
});
router.post('/category/edit/:id', Category.edit);
router.post('/category/del', function(req, res, next) {
  Category.delete(req, res, next);
});



const upload = multer({ dest: 'uploads/' });
router.post('/members/import_excel', upload.single('file'), async (req, res) => {
  try {
    // 3. Parse the Excel file and extract the data
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);

    const data = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        data.push({
          membership_number: row.getCell(1).value,
          name: row.getCell(2).value,
          phone_number: row.getCell(3).value,
          email: row.getCell(4).value,
          address: row.getCell(5).address,
          session: row.getCell(6).value,
          hsc_passing_year: row.getCell(7).value,
          occupation: row.getCell(8).value,
          organization_name: row.getCell(9).value,
          designation_name: row.getCell(10).value,
          membership_category_id: row.getCell(11).value,
          password: '123456',
          member_image: 'default.jpg',

        });
      }
    });

    // 4. Save the extracted data to your database using Sequelize
    await MemberModel.bulkCreate(data);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Error importing data:', error);
    req.flash('error', 'Error importing data!');
    res.redirect('/member');
  }
});

router.post('/members/excel_report', Member.excel_report);

router.get('/scrolling_news', function(req, res, next) {
  if (isLogin(req, res)) {
    ScrollingNews.list(req, res, next);
  }
});
router.post('/scrolling_news/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    ScrollingNews.data_list(req, res, next);
  }
});
router.get('/scrolling_news/add', function(req, res, next) {
  if (isLogin(req, res)) {
    ScrollingNews.add_from(req, res, next);
  }
});
router.post('/scrolling_news/add', ScrollingNews.add);
router.get('/scrolling_news/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    ScrollingNews.edit_from(req, res, next);
  }
});
router.post('/scrolling_news/edit/:id', ScrollingNews.edit);
router.post('/scrolling_news/del', function(req, res, next) {
  ScrollingNews.delete(req, res, next);
});

//==================================================================

router.get('/job', function(req, res, next) {
  if (isLogin(req, res)) {
    Job.list(req, res, next);
  }
});
router.post('/job/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Job.data_list(req, res, next);
  }
});
router.get('/job/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Job.add_from(req, res, next);
  }
});
router.post('/job/add', Job.add);
router.get('/job/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Job.edit_from(req, res, next);
  }
});
router.post('/job/edit/:id', Job.edit);
router.post('/job/del', function(req, res, next) {
  Job.delete(req, res, next);
});


//======================================================

router.get('/occupation', function(req, res, next) {
  if (isLogin(req, res)) {
    Occupation.list(req, res, next);
  }
});
router.post('/occupation/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Occupation.data_list(req, res, next);
  }
});
router.get('/occupation/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Occupation.add_from(req, res, next);
  }
});
router.post('/occupation/add', Occupation.add);
router.get('/occupation/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Occupation.edit_from(req, res, next);
  }
});
router.post('/occupation/edit/:id', Occupation.edit);
router.post('/occupation/del', function(req, res, next) {
  Occupation.delete(req, res, next);
});

//==================================================================
router.get('/batch_session', function(req, res, next) {
  if (isLogin(req, res)) {
    BatchSession.list(req, res, next);
  }
});
router.post('/batch_session/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    BatchSession.data_list(req, res, next);
  }
});
router.get('/batch_session/add', function(req, res, next) {
  if (isLogin(req, res)) {
    BatchSession.add_from(req, res, next);
  }
});
router.post('/batch_session/add', BatchSession.add);
router.get('/batch_session/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    BatchSession.edit_from(req, res, next);
  }
});
router.post('/batch_session/edit/:id', BatchSession.edit);
router.post('/batch_session/del', function(req, res, next) {
  BatchSession.delete(req, res, next);
});

//======================================================================
router.get('/members', function(req, res, next) {
  if (isLogin(req, res)) {
    Member.list(req, res, next);
  }
});
router.post('/members/data_list', function(req, res, next) {
  if (isLogin(req, res)) {
    Member.data_list(req, res, next);
  }
});
router.get('/member/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Member.add_from(req, res, next);
  }
});
router.post('/member/add', Member.add);

router.get('/member/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Member.edit_from(req, res, next);
  }
});
router.post('/member/edit/:id', Member.edit);
router.post('/member/del', function(req, res, next) {
  Member.delete(req, res, next);
});


//==================================================================
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
router.get('/programs', function(req, res, next) {
  if (isLogin(req, res)) {
    Programs.list(req, res, next);
  }
});
router.post('/programs/data-list', function(req, res, next) {
  if (isLogin(req, res)) {
    Programs.data_list(req, res, next);
  }
});
router.get('/programs/add', function(req, res, next) {
  if (isLogin(req, res)) {
    Programs.add_from(req, res, next);
  }
});
router.post('/programs/add', Programs.add);
router.get('/programs/edit/:id', function(req, res, next) {
  if (isLogin(req, res)) {
    Programs.edit_from(req, res, next);
  }
});
router.post('/programs/edit/:id', Programs.edit);
router.post('/programs/del', function(req, res, next) {
  Programs.delete(req, res, next);
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
