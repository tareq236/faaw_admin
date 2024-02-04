const { sequelize, MemberModel, MenuModel} = require("../../models");
const { QueryTypes } = require('sequelize');
const CommonFunction = require('../common_function');
const validations = require('../validations');
const { check, validationResult } = require('express-validator');
const fields = [
  {param: 'name'},
  {param: 'phone_number'},
  {param: 'email'},
  {param: 'session'},
  {param: 'occupation'},
  {param: 'organization_name'},
  {param: 'designation_name'},
  {param: 'password'},
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
    validation: validations.all_field_validations(null, fields)
  });
};

exports.add = [
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
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
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
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
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
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
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
    name: result.name,
    phone_number: result.phone_number,
    email: result.email,
    session: result.session,
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
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
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
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
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
        name: req.body.name,
        phone_number: req.body.phone_number,
        email: req.body.email,
        session: req.body.session,
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
