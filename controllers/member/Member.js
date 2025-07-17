const { sequelize, MemberModel, MenuModel} = require("../../models");
const { QueryTypes } = require('sequelize');
const CommonFunction = require('../common_function');
const validations = require('../validations');
const { check, validationResult } = require('express-validator');
const excel = require("exceljs");
const moment = require("moment");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
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
  {param: 'address'},
];

exports.list = (req, res, next) => {
  const categoryid = req.query.categoryid;
  res.render('member/index', {data: {categoryid: categoryid}})
};
exports.expired_members = (req, res, next) => {
  res.render('member/expired_members', {})
};

exports.data_list = async (req, res, next) => {
  let offset = req.body.start;
  let limit = req.body.length;
  let page_num = req.body.draw;
  let search = req.body['search'];
  let search_value = search.value;
  let categoryid = req.body.categoryid;
  let query_str = " WHERE ml.status = 1 ";
  if(categoryid){
    query_str = query_str +` AND ml.membership_category_id = ${categoryid} `;
  }
  if(search_value){
    // query_str = query_str + " AND email like " + '%'+search+'%';
    query_str = query_str + " AND (ml.email LIKE '%" + search_value + "%' OR ml.name LIKE '%" + search_value + "%' OR ml.phone_number LIKE '%" + search_value + "%') ";
  }

  const query_data = await sequelize.query(`SELECT ml.*, c.category_name FROM member_list ml INNER JOIN category_list c ON ml.membership_category_id = c.id  ${query_str} ORDER BY ml.id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
  const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM member_list ml INNER JOIN category_list c ON ml.membership_category_id = c.id ${query_str};`, { type: QueryTypes.SELECT });

  query_data.forEach(function(e) { e.action = CommonFunction.action_menu_edit_del_others(e.id, "member") });
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

exports.expired_data_list = async (req, res, next) => {
  let offset = req.body.start;
  let limit = req.body.length;
  let page_num = req.body.draw;
  let search = req.body['search'];
  let search_value = search.value;
  let query_str = " WHERE status = 1 AND is_pay=0";
  if(search_value){
    // query_str = query_str + " AND email like " + '%'+search+'%';
    query_str = query_str + " AND (email LIKE '%" + search_value + "%' OR name LIKE '%" + search_value + "%' OR phone_number LIKE '%" + search_value + "%') ";
  }

  const query_data = await sequelize.query(`SELECT * FROM member_list ${query_str} ORDER BY id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
  const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM member_list ${query_str};`, { type: QueryTypes.SELECT });

  query_data.forEach(function(e) { e.action = CommonFunction.action_menu_edit_del_others(e.id, "member") });
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
  const category_list = await sequelize.query(`SELECT * FROM category_list WHERE status = 1;`, { type: QueryTypes.SELECT });

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
    category_list: category_list,
    password: '',
    hsc_passing_year: '',
    member_image: "",
    membership_category_id: "",
    address: "",
    validation: validations.all_field_validations(null, fields)
  });
};

exports.add = [async (req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/member');
    },
    filename:(req,file,cb)=>{
      cb(null, "member_"+Date.now()+path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
  }).single('_image');

  const errorHandlerProductList = (err) => {
    req.flash('error', err.original.sqlMessage);
    res.redirect('/member/add');
  };
  const errorHandlerUpload = async (err, _id) => {
    req.flash('error', err);
    res.redirect('/member/add');
  };
  const errorHandler = async (err, _id) => {
    req.flash('error', err);
    res.redirect('/member/add');
  };
  upload(req, res, async ( err ) => {
    if (err) {
      await errorHandlerUpload(err);
    } else {
      let image = "";
      if(req.file === undefined){
        req.flash('error', "Please add image");
        res.redirect('/member/add');
      }else{
        const resizedImagePath = 'public/member/resized_' + req.file.filename;
        await sharp(req.file.path)
          .resize(150, 150) // Resize to 300x300 pixels
          .toFile(resizedImagePath)
          .catch(errorHandler);

        image = resizedImagePath.split('public/member/')[1];
        // image = req.file.filename;
      }
      if(req.body.name === ""){
        req.flash('error', "Please enter name");
        res.redirect('/member/add');
      }
      if(req.body.phone_number === ""){
        req.flash('error', "Please enter phone number");
        res.redirect('/member/add');
      }

      let prefix = "";
      switch (req.body.membership_category_id) {
        case "3":
          prefix = "LM"; break;
        case "4":
          prefix = "GM"; break;
        case "6":
          prefix = "SM"; break;
        default:
          prefix = "MB"; // fallback
      }
      // Get max ID for this category
      const maxEntry = await MemberModel.findOne({
        where: { membership_category_id: req.body.membership_category_id },
        order: [['id', 'DESC']],
        attributes: ['id']
      });

      const nextId = maxEntry ? maxEntry.id + 1 : 1;
      const membership_number = `${prefix}${nextId}`;

      if(req.file !== undefined && req.body.name !== "" && req.body.phone_number !== ""){
        let insert_data = {
          membership_number: membership_number,
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
          membership_category_id: req.body.membership_category_id,
          address: req.body.address,
          member_image: image,
        };
        const save_date = await MemberModel.create(insert_data).catch(errorHandlerProductList);
        req.flash('success', 'Data add successfully!');
        res.redirect('/member/add');
      }
    }
  })
}];

exports.edit_from = async (req, res, next) => {
  let id = req.params.id;

  const batch_session_list = await sequelize.query(`SELECT * FROM batch_session_list WHERE status = 1;`, { type: QueryTypes.SELECT });
  const occupation_list = await sequelize.query(`SELECT * FROM occupation_list WHERE status = 1;`, { type: QueryTypes.SELECT });
  const category_list = await sequelize.query(`SELECT * FROM category_list WHERE status = 1;`, { type: QueryTypes.SELECT });

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
    category_list: category_list,
    member_image: result.member_image,
    membership_category_id: result.membership_category_id,
    address: result.address,
    id: result.id,
    validation: validations.all_field_validations(null, fields)
  });
};

exports.edit = [async (req, res, next) => {
  let id = req.params.id;
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/member');
    },
    filename:(req,file,cb)=>{
      cb(null, "member_"+Date.now()+path.extname(file.originalname));
    }
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
  }).single('_image');

  const errorHandlerProductList = (err) => {
    req.flash('error', err.original.sqlMessage);
    res.redirect('/member/edit/'+id);
  };
  const errorHandlerUpload = async (err, _id) => {
    req.flash('error', err);
    res.redirect('/member/edit/'+id);
  };

  upload(req, res, async ( err ) => {
    if (err) {
      await errorHandlerUpload(err);
    } else {
      let image = "";
      if(req.file !== undefined){
        image = req.file.filename;
      }
      if(req.body.name === ""){
        req.flash('error', "Please enter name");
        res.redirect('/member/edit/'+id);
      }
      if(req.body.phone_number === ""){
        req.flash('error', "Please enter phone number");
        res.redirect('/member/edit/'+id);
      }
      if(req.body.name !== "" && req.body.phone_number !== ""){
        let update_data = {
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
          membership_category_id: req.body.membership_category_id,
          address: req.body.address,
          member_image: image,
        };
        if(image===""){
          delete update_data.member_image;
        }
        const save_date = await MemberModel.update(update_data,{ where: { id: req.body.id } }).catch(errorHandlerProductList);
        req.flash('success', 'Data update successfully!');
        res.redirect('/member/edit/'+id);
      }

    }
  })
}];

exports.delete = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({success: false, error: err.original.sqlMessage});
  };
  const results = await MemberModel.destroy({where:{id:req.body.del_id}}).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: results
  });
};

exports.approve = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({success: false, error: err.original.sqlMessage});
  };
  const results = await MemberModel.update({admin_approval: 1},{ where: { id: req.body.approve_id } }).catch(errorHandler);
  return res.status(200).json({
    success: true,
    result: results
  });
};

exports.not_approve = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(500).json({success: false, error: err.original.sqlMessage});
  };
  const results = await MemberModel.update({admin_approval: 0},{ where: { id: req.body.approve_id } }).catch(errorHandler);
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

    if (errors.errors.length !== 0) {
      validation = false;
      errors.errors.forEach((err) => {
        validation_message += err.msg + "<br />";
      });
      req.flash("error", validation_message);
      return res.redirect("/member");
    }

    try {
      file_name = "Excel_Member";
      const list = await sequelize.query(`SELECT * FROM member_list;`, {
        type: QueryTypes.SELECT,
      });

      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("Members");

      worksheet.columns = [
        { header: "Membership Number", key: "membership_number", width: 20 },
        { header: "Name", key: "name", width: 20 },
        { header: "Phone Number", key: "phone_number", width: 20 },
        { header: "Email", key: "email", width: 25 },
        { header: "Address", key: "address", width: 30 },
        { header: "Session/Batch", key: "session", width: 15 },
        { header: "HSC Passing Year", key: "hsc_passing_year", width: 20 },
        { header: "Occupation", key: "occupation", width: 20 },
        { header: "Organization name", key: "organization_name", width: 25 },
        { header: "Designation name", key: "designation_name", width: 25 },
        {
          header: "Membership Category",
          key: "membership_category_id",
          width: 20,
        },
      ];

      const sanitize = (value) => {
        if (!value) return "";
        return String(value)
          .replace(/\\/g, "\\\\") // Escape backslashes
          .replace(/"/g, '\\"') // Escape double quotes
          .replace(/\r/g, "") // Remove carriage returns
          .replace(/\n/g, " "); // Replace newlines with space
      };

      list.forEach((member) => {
        const json_obj = {
          membership_number: sanitize(member.membership_number),
          name: sanitize(member.name),
          phone_number: sanitize(member.phone_number),
          email: sanitize(member.email),
          address: sanitize(member.address),
          session: sanitize(member.session),
          hsc_passing_year: sanitize(member.hsc_passing_year),
          occupation: sanitize(member.occupation),
          organization_name: sanitize(member.organization_name),
          designation_name: sanitize(member.designation_name),
          membership_category_id: sanitize(member.membership_category_id),
        };

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

      return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
      });
    } catch (err) {
      console.error("Excel Export Error:", err);
      req.flash("error", "Excel export failed!");
      return res.redirect("/member");
    }
  },
];
