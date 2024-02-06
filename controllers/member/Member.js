const { sequelize, MemberModel, MenuModel} = require("../../models");
const { QueryTypes } = require('sequelize');
const CommonFunction = require('../common_function');
const validations = require('../validations');
const { check, validationResult } = require('express-validator');
const excel = require("exceljs");
const moment = require("moment");
const fields = [
  {param: 'membership_number'},
  {param: 'name'},
  {param: 'phone_number'},
  {param: 'email'},
  {param: 'session'},
  {param: 'occupation'},
  {param: 'organization_name'},
  {param: 'designation_name'},
  {param: 'password'},
  {param: 'hsc_passing_year'},
];


exports.list = (req, res, next) => {
  res.render('member/index', {})
};

exports.data_list = async (req, res, next) => {
  let offset = req.body.start;
  let limit = req.body.length;
  let page_num = req.body.draw;
  let search = req.body['search[value]'];
  let query_str = "";
  if(search !== ""){
    query_str = query_str + " AND email like " + '%'+search+'%';
  }

  const query_data = await sequelize.query(`SELECT * FROM member_list ${query_str} ORDER BY id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
  const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM member_list ${query_str};`, { type: QueryTypes.SELECT });

  query_data.forEach(function(e) { e.action = CommonFunction.action_menu_edit_del(e.id, "member") });
  let num_of_rows = query_data_count[0].num_of_row;

  if(query_data.length !== 0){
    return res.status(200).json({
      success: true,
      recordsTotal: query_data.length,
      recordsFiltered: num_of_rows,
      data: query_data
    });
  }else{
    return res.status(200).json({
      success: true,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: query_data
    });
  }
};

exports.add_from = async (req, res, next) => {
  const batch_session_list = await sequelize.query(`SELECT * FROM batch_session_list WHERE status = 1;`, { type: QueryTypes.SELECT });
  const occupation_list = await sequelize.query(`SELECT * FROM occupation_list WHERE status = 1;`, { type: QueryTypes.SELECT });

  res.render('member/add', {
    membership_number: "",
    name: "",
    phone_number: "",
    email: "",
    session: "",
    occupation: "",
    organization_name: "",
    designation_name: "",
    status: 1,
    admin_approval: 0,
    batch_session_list: batch_session_list,
    occupation_list: occupation_list,
    password: '',
    hsc_passing_year: '',
    validation: validations.all_field_validations(null, fields)
  });
};

exports.add = [
  check('membership_number').notEmpty().withMessage('Please enter membership number'),
  check('name').notEmpty().withMessage('Please enter name'),
  check('phone_number').notEmpty().withMessage('Please enter phone number'),
  check('email').notEmpty().withMessage('Please enter email'),
  check('organization_name').notEmpty().withMessage('Please enter organization name'),
  check('designation_name').notEmpty().withMessage('Please enter designation name'),
  check('password').notEmpty().withMessage('Please enter password'),
  async (req, res, next) => {

    const errors = validationResult(req);

    const batch_session_list = await sequelize.query(`SELECT * FROM batch_session_list WHERE status = 1;`, { type: QueryTypes.SELECT });
    const occupation_list = await sequelize.query(`SELECT * FROM occupation_list WHERE status = 1;`, { type: QueryTypes.SELECT });

    const errorHandler = (err) => {
      console.log(err)
      req.flash('error', err.original.sqlMessage);
      res.render('member/add', {
        membership_number: req.body.membership_number,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
        hsc_passing_year: req.body.hsc_passing_year,
        occupation: req.body.occupation,
        organization_name: req.body.organization_name,
        designation_name: req.body.designation_name,
        status: req.body.status,
        password: req.body.password,
        admin_approval: req.body.admin_approval,
        batch_session_list: batch_session_list,
        occupation_list: occupation_list,
        validation: validations.all_field_validations(null, fields)
      });
    };
    if(errors.errors.length !== 0){
      res.render('member/add',{
        membership_number: req.body.membership_number,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
        hsc_passing_year: req.body.hsc_passing_year,
        occupation: req.body.occupation,
        organization_name: req.body.organization_name,
        designation_name: req.body.designation_name,
        status: req.body.status,
        password: req.body.password,
        admin_approval: req.body.admin_approval,
        batch_session_list: batch_session_list,
        occupation_list: occupation_list,
        validation: validations.all_field_validations(errors.errors, fields)
      });
    }else{
      let insert_data = {
        membership_number: req.body.membership_number,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
        hsc_passing_year: req.body.hsc_passing_year,
        occupation: req.body.occupation,
        organization_name: req.body.organization_name,
        designation_name: req.body.designation_name,
        status: req.body.status,
        password: req.body.password,
        admin_approval: req.body.admin_approval,
      };
      const save_date = await MemberModel.create(insert_data).catch(errorHandler);
      req.flash('success', 'Data add successfully!');
      res.redirect('/member/add');
    }
  }];

exports.edit_from = async (req, res, next) => {
  let id = req.params.id;

  const batch_session_list = await sequelize.query(`SELECT * FROM batch_session_list WHERE status = 1;`, { type: QueryTypes.SELECT });
  const occupation_list = await sequelize.query(`SELECT * FROM occupation_list WHERE status = 1;`, { type: QueryTypes.SELECT });

  const errorHandler = (err) => {
    req.flash('error', err.original.sqlMessage);
    res.redirect('/member/edit/'+id);
  };
  let result = await MemberModel.findOne({ where: {id: id}, order: [ [ 'id', 'DESC' ]] }).catch(errorHandler);
  res.render('member/edit', {
    membership_number: result.membership_number,
    name: result.name,
    phone_number: result.phone_number,
    email: result.email,
    session: result.session,
    hsc_passing_year: result.hsc_passing_year,
    occupation: result.occupation,
    organization_name: result.organization_name,
    designation_name: result.designation_name,
    status: result.status,
    admin_approval: result.admin_approval,
    batch_session_list: batch_session_list,
    occupation_list: occupation_list,
    password: result.password,
    id: result.id,
    validation: validations.all_field_validations(null, fields)
  });
};

exports.edit = [
  check('membership_number').notEmpty().withMessage('Please enter membership number'),
  check('name').notEmpty().withMessage('Please enter name'),
  check('phone_number').notEmpty().withMessage('Please enter phone number'),
  check('email').notEmpty().withMessage('Please enter email'),
  check('organization_name').notEmpty().withMessage('Please enter organization name'),
  check('designation_name').notEmpty().withMessage('Please enter designation name'),
  check('password').notEmpty().withMessage('Please enter password'),
  async (req, res, next) => {

    const errors = validationResult(req);

    const batch_session_list = await sequelize.query(`SELECT * FROM batch_session_list WHERE status = 1;`, { type: QueryTypes.SELECT });
    const occupation_list = await sequelize.query(`SELECT * FROM occupation_list WHERE status = 1;`, { type: QueryTypes.SELECT });

    const errorHandler = (err) => {
      console.log(err)
      req.flash('error', err.original.sqlMessage);
      res.render('member/edit', {
        membership_number: req.body.membership_number,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
        hsc_passing_year: req.body.hsc_passing_year,
        occupation: req.body.occupation,
        organization_name: req.body.organization_name,
        designation_name: req.body.designation_name,
        status: req.body.status,
        password: req.body.password,
        admin_approval: req.body.admin_approval,
        batch_session_list: batch_session_list,
        occupation_list: occupation_list,
        id: req.body.id,
        validation: validations.all_field_validations(null, fields)
      });
    };
    if(errors.errors.length !== 0){
      res.render('member/edit',{
        membership_number: req.body.membership_number,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
        hsc_passing_year: req.body.hsc_passing_year,
        occupation: req.body.occupation,
        organization_name: req.body.organization_name,
        designation_name: req.body.designation_name,
        status: req.body.status,
        password: req.body.password,
        admin_approval: req.body.admin_approval,
        batch_session_list: batch_session_list,
        occupation_list: occupation_list,
        id: req.body.id,
        validation: validations.all_field_validations(errors.errors, fields)
      });
    }else{
      let update_data = {
        membership_number: req.body.membership_number,
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
        hsc_passing_year: req.body.hsc_passing_year,
        occupation: req.body.occupation,
        organization_name: req.body.organization_name,
        designation_name: req.body.designation_name,
        status: req.body.status,
        password: req.body.password,
        admin_approval: req.body.admin_approval,
        id: req.body.id,
      };
      const update_date = await MemberModel.update(update_data, { where: { id: req.body.id } }).catch(errorHandler);
      req.flash('success', 'Data edit successfully!');
      res.redirect('/member/edit/'+req.body.id);
    }
  }];

exports.delete = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({success: false, error: err.original.sqlMessage});
  };
  const results = await MenuModel.destroy({where:{id:req.body.del_id}}).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: results
  });
};

exports.excel_report = [
  async (req, res, next) => {

    let file_name = "";
    const errors = validationResult(req);
    let validation = true;
    let validation_message = "";
    if (errors.errors.length === 0) {
      validation = true;
    } else {
      validation = false;
    }

    if (validation) {
      file_name = "Excel_Member";
      const list = await sequelize.query(`SELECT * FROM member_list;`, {type: QueryTypes.SELECT});

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Prescription");
      worksheet.columns = [
        {header: "Membership Number", key: "membership_number", width: 20},
        {header: "Name", key: "name", width: 10},
        {header: "Phone Number", key: "phone_number", width: 30},
        {header: "Email", key: "email", width: 30},
        {header: "Session/Batch", key: "session", width: 10},
        {header: "HSC Passing Year", key: "hsc_passing_year", width: 10},
        {header: "Occupation", key: "occupation", width: 20},
        {header: "Organization name", key: "organization_name", width: 20},
        {header: "Designation name", key: "designation_name", width: 20},
        {header: "Status", key: "status", width: 20},
        {header: "Admin Approval", key: "admin_approval", width: 20},
        {header: "Created At", key: "created_at", width: 20},
      ];
      list.forEach((list_obj) => {
        let a_row = "{";
        a_row = a_row + '"membership_number":"' + list_obj.membership_number + '",';
        a_row = a_row + '"name":"' + list_obj.name + '",';
        a_row = a_row + '"phone_number":"' + list_obj.phone_number + '",';
        a_row = a_row + '"email":"' + list_obj.email + '",';
        a_row = a_row + '"session":"' + list_obj.session + '",';
        a_row = a_row + '"hsc_passing_year":"' + list_obj.hsc_passing_year + '",';
        a_row = a_row + '"occupation":"' + list_obj.occupation + '",';
        a_row = a_row + '"organization_name":"' + list_obj.organization_name + '",';
        a_row = a_row + '"designation_name":"' + list_obj.designation_name + '",';
        a_row = a_row + '"status":"' + list_obj.status + '",';
        a_row = a_row + '"admin_approval":"' + list_obj.admin_approval + '",';
        a_row = a_row + '"created_at":"' + moment(list_obj.created_at).format('DD-MMM-YYYY h:m:s') + '"}';
        let json_obj = JSON.parse(a_row);
        worksheet.addRow(json_obj);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + file_name + ".xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });

    } else {
      for (let i = 0; i < errors.errors.length; i++) {
        validation_message += errors.errors[i].msg + "<br />";
      }
      req.flash('error', validation_message);
      res.redirect('/member');
    }
  }];

