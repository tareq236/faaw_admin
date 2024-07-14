const { sequelize, EventModel, BranchModel} = require("../../models");
const { QueryTypes } = require('sequelize');
const CommonFunction = require('../common_function');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const sharp = require("sharp");

exports.list = (req, res, next) => {
    res.render('event/index', { })
};

exports.data_list = async (req, res, next) => {
    let offset = req.body.start;
    let limit = req.body.length;

    const query_data = await sequelize.query(`SELECT el.* FROM event_list el ORDER BY el.id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
    const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM event_list el;`, { type: QueryTypes.SELECT });

    query_data.forEach(function(e) { e.action = CommonFunction.action_menu_edit_del_add_image(e.id, "event") });
    let num_of_rows = query_data_count[0].num_of_row;

    if(query_data.length !== 0){
        return res.status(200).json({
            success: true,
            recordsTotal: query_data.length,
            recordsFiltered: num_of_rows,
            data: query_data,
        });
    }else{
        return res.status(200).json({
            success: true,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: query_data,
        });
    }
};

exports.add_from = async (req, res, next) => {
    const errorHandler = (err) => {
        req.flash('error', err.original.sqlMessage);
        res.redirect('/event/add');
    };

    res.render('event/add', {
      event_title: "",
      event_venue: "",
      event_details: "",
      event_short_details: "",
      event_date: "",
      event_type: "",
      cover_image: "",
      status: "",
      event_fees: "",
      event_session: "Upcoming Event",
    });
};

exports.add = [async (req, res, next) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/cover_image_event');
        },
        filename:(req,file,cb)=>{
            cb(null, "cover_event_"+Date.now()+path.extname(file.originalname));
        }
    });
    const upload = multer({
        storage: storage,
        limits: { fileSize: 50 * 1024 * 1024 }
    }).single('_image');


    const errorHandlerProductList = (err) => {
        req.flash('error', err.original.sqlMessage);
        res.redirect('/event/add');
    };
    const errorHandlerUpload = async (err, _id) => {
        req.flash('error', err);
        res.redirect('/event/add');
    };
    const errorHandler = async (err, _id) => {
        req.flash('error', err);
        res.redirect('/event/add');
    };

    // Upload image
    upload(req, res, async ( err ) => {
        if (err) {
            await errorHandlerUpload(err);
        } else {
            let image = "";
            if(req.file === undefined){
                req.flash('error', "Please add image");
                res.redirect('/event/add');
            }else{
              if(req.body.event_session === "Upcoming Event"){
                const resizedImagePath = 'public/cover_image_event/resized_' + req.file.filename;
                await sharp(req.file.path)
                  .resize(650, 450) // Resize to 300x300 pixels
                  .toFile(resizedImagePath)
                  .catch(errorHandler);
                image = resizedImagePath.split('public/cover_image_event/')[1];
              }else{
                const resizedImagePath = 'public/cover_image_event/resized_' + req.file.filename;
                await sharp(req.file.path)
                  .resize(370, 220) // Resize to 300x300 pixels
                  .toFile(resizedImagePath)
                  .catch(errorHandler);
                image = resizedImagePath.split('public/cover_image_event/')[1];
              }
                // image = req.file.filename;
            }
            if(req.body.event_title === ""){
                req.flash('error', "Please enter event title");
                res.redirect('/event/add');
            }
            if(req.body.event_details === ""){
                req.flash('error', "Please enter event details");
                res.redirect('/event/add');
            }
            if(req.body.event_date === ""){
                req.flash('error', "Please enter event date");
                res.redirect('/event/add');
            }

            if(req.file !== undefined && req.body.name !== "" && req.body.event_title !== "" && req.body.event_details !== "" && req.body.event_date !== ""){
                let insert_data = {
                  event_title: req.body.event_title,
                  event_venue: req.body.event_venue,
                  event_details: req.body.event_details,
                  event_short_details: req.body.event_short_details,
                  event_date: req.body.event_date,
                  event_type: req.body.event_type,
                  cover_image: image,
                  status: req.body.status,
                  event_fees: req.body.event_fees,
                  event_session: req.body.event_session
                };

                const save_date = await EventModel.create(insert_data).catch(errorHandlerProductList);
                req.flash('success', 'Data add successfully!');
                res.redirect('/event/add');
            }
        }
    });
}];

exports.edit_from = async (req, res, next) => {
    let id = req.params.id;
    const errorHandler = (err) => {
        req.flash('error', err.original.sqlMessage);
        res.redirect('/event/edit/'+id);
    };
    let result = await EventModel.findOne({ where: {id: id} }).catch(errorHandler);
    res.render('event/edit', {
      event_title: result.event_title,
      event_venue: result.event_venue,
      event_details: result.event_details,
      event_short_details: result.event_short_details,
      event_date: result.event_date,
      event_type: result.event_type,
      cover_image: result.cover_image,
      status: result.status,
      event_session: result.event_session,
      event_fees: result.event_fees,
      id: result.id,
      moment: moment
    });
};

exports.edit = [async (req, res, next) => {
    let id = req.params.id;

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/cover_image_event');
        },
        filename:(req,file,cb)=>{
            cb(null, "cover_event_"+Date.now()+path.extname(file.originalname));
        }
    });
    const upload = multer({
        storage: storage,
        limits: { fileSize: 50 * 1024 * 1024 }
    }).single('_image');


    const errorHandlerProductList = (err) => {
        req.flash('error', err);
        res.redirect('/event/edit/'+id);
    };
    const errorHandlerUpload = async (err) => {
        req.flash('error', err);
        res.redirect('/event/edit/'+id);
    };
  const errorHandler = async (err) => {
    req.flash('error', err);
    res.redirect('/event/edit/'+id);
  };

    // Upload image
    upload(req, res, async ( err ) => {
        if (err) {
            await errorHandlerUpload(err);
        } else {
            let image = "";
            if(req.file !== undefined){
              if(event_session === "Upcoming Event"){
                const resizedImagePath = 'public/cover_image_event/resized_' + req.file.filename;
                await sharp(req.file.path)
                  .resize(650, 450) // Resize to 300x300 pixels
                  .toFile(resizedImagePath)
                  .catch(errorHandler);
                image = resizedImagePath.split('public/cover_image_event/')[1];
              }else{
                const resizedImagePath = 'public/cover_image_event/resized_' + req.file.filename;
                await sharp(req.file.path)
                  .resize(370, 220) // Resize to 300x300 pixels
                  .toFile(resizedImagePath)
                  .catch(errorHandler);
                image = resizedImagePath.split('public/cover_image_event/')[1];
              }

              // image = req.file.filename;
            }
            if(req.body.event_title === ""){
                req.flash('error', "Please enter event title");
                res.redirect('/event/edit/'+id);
            }
            if(req.body.event_date === ""){
                req.flash('error', "Please enter event date");
                res.redirect('/event/edit/'+id);
            }

            if(req.body.name !== "" && req.body.event_title !== "" && req.body.event_details !== ""){
                let update_data = {
                  event_title: req.body.event_title,
                  event_venue: req.body.event_venue,
                  event_details: req.body.event_details,
                  event_short_details: req.body.event_short_details,
                  event_date: req.body.event_date,
                  event_type: req.body.event_type,
                  cover_image: image,
                  status: req.body.status,
                  event_session: req.body.event_session,
                  event_fees: req.body.event_fees
                };
                if(image===""){
                    delete update_data.cover_image;
                }
                if(req.body.event_date===""){
                    delete update_data.event_date;
                }
                const update_date = await EventModel.update(update_data,{ where: { id: req.body.id } }).catch(errorHandlerProductList);
                req.flash('success', 'Data update successfully!');
                res.redirect('/event/edit/'+id);
            }
        }
    });
}];

exports.delete = async (req, res, next) => {
    const errorHandler = (err) => {
        return res.status(500).json({success: false, error: err.original.sqlMessage});
    };
    const results = await EventModel.destroy({ where: { id: req.body.del_id } }).catch(errorHandler);
    return res.status(200).json({
        success: true,
        result: results
    });
};
