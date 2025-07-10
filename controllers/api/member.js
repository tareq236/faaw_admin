const { sequelize, MemberModel, MemberApprovalModel, AdminLogin} = require("../../models");
const {QueryTypes} = require("sequelize");
const multer = require("multer");
const path = require("path");
const sharp = require('sharp');

exports.MemberUpdate  = async (req, res, next) => {
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

  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };
  const errorHandlerUpload = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };
  upload(req, res, async ( err ) => {
    if (err) {
      await errorHandlerUpload(err);
    } else {
      let image = "";
      if (req.file !== undefined){
        const resizedImagePath = 'public/member/resized_' + req.file.filename;
        await sharp(req.file.path)
          .resize(150, 150) // Resize to 300x300 pixels
          .toFile(resizedImagePath)
          .catch(errorHandler);

        image = resizedImagePath.split('public/member/')[1];
      }

      if(req.body.membership_number === ""){
        return res.status(200).json({
          success: false,
          message: "Please enter membership number"
        });
      }
      if(req.body.name === ""){
        return res.status(200).json({
          success: false,
          message: "Please enter name"
        });
      }
      if(req.body.phone_number === ""){
        return res.status(200).json({
          success: false,
          message: "Please enter phone number"
        });
      }

      if(req.body.membership_number !== "" && req.body.name !== "" && req.body.phone_number !== "") {
        let update_data = {
          membership_number: req.body.membership_number,
          name: req.body.name,
          phone_number: req.body.phone_number,
          email: req.body.email,
          address: req.body.address,
          session: req.body.session,
          hsc_passing_year: req.body.hsc_passing_year,
          occupation: req.body.occupation,
          organization_name: req.body.organization_name,
          designation_name: req.body.designation_name,
          status: req.body.status,
          password: req.body.password,
          admin_approval: req.body.admin_approval,
          membership_category_id: req.body.membership_category_id,
            linkedin_link: req.body.linkedin_link,
            facebook_link: req.body.facebook_link,
            twitter_link: req.body.twitter_link,
            blood_group: req.body.blood_group,
            gender: req.body.gender,
            date_of_birth: req.body.date_of_birth,
          member_image: image
        };
        if (req.file !== undefined) {
          update_data.member_image = image;
        }

        let userDetails = await MemberModel.findOne({ where: {id: req.body.id}}).catch(errorHandler);
        if(userDetails !== null){
          try {
            const userInsertDetails = await MemberModel.update(update_data,{ where: { id: req.body.id } }).catch(errorHandler);
            return res.status(200).json({
              success: true,
              result: userInsertDetails,
            });
          } catch (error) {
            return res.status(200).json({
              success: false,
              error: error
            });
          }
        }else{
          return res.status(200).json({
            success: false,
            message: "Member fot found"
          });
        }

      }else{
        return res.status(200).json({
          success: false,
          message: "Please fill up required field"
        });
      }
    }
  })
};

exports.Save  = async (req, res, next) => {
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

  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };
  const errorHandlerUpload = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };
  upload(req, res, async ( err ) => {
    if (err) {
      await errorHandlerUpload(err);
    } else {
      let image = "";
      if (req.file !== undefined){
        const resizedImagePath = 'public/member/resized_' + req.file.filename;
        await sharp(req.file.path)
          .resize(150, 150) // Resize to 300x300 pixels
          .toFile(resizedImagePath)
          .catch(errorHandler);

        image = resizedImagePath.split('public/member/')[1];
      }

      // image = req.file.filename;

      if(req.body.name === ""){
        return res.status(200).json({
          success: false,
          message: "Please enter name"
        });
      }
      if(req.body.phone_number === ""){
        return res.status(200).json({
          success: false,
          message: "Please enter phone number"
        });
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

      if(req.body.name !== "" && req.body.phone_number !== "") {
        let insert_data = {
          membership_number: membership_number,
          name: req.body.name,
          phone_number: req.body.phone_number,
          email: req.body.email,
          address: req.body.address,
          session: req.body.session,
          hsc_passing_year: req.body.hsc_passing_year,
          occupation: req.body.occupation,
          organization_name: req.body.organization_name,
          designation_name: req.body.designation_name,
          status: req.body.status,
          password: req.body.password,
          admin_approval: req.body.admin_approval,
          membership_category_id: req.body.membership_category_id,
          member_image: image,
        };

        let userDetails = await MemberModel.findOne({ where: {email: req.body.email}}).catch(errorHandler);
        if(userDetails === null){
          try {
            const userInsertDetails = await MemberModel.create(insert_data).catch(errorHandler);
            return res.status(200).json({
              success: true,
              result: userInsertDetails,
            });
          } catch (error) {
            return res.status(200).json({
              success: false,
              error: error
            });
          }
        }else{
          return res.status(200).json({
            success: false,
            message: "User email already registered!"
          });
        }

      }else{
        return res.status(200).json({
          success: false,
          message: "Please fill up required field"
        });
      }
    }
  })
};

exports.Check  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  if(req.body.email === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter email!"
    });
  }else if(req.body.password === "") {
    return res.status(200).json({
      success: false,
      message: "Please enter password!"
    });
  }else{
    let userDetails = await MemberModel.findOne({ where: {email: req.body.email, password: req.body.password}}).catch(errorHandler);
    if(userDetails !== null){
      return res.status(200).json({
        success: true,
        result: userDetails,
      });
    }else{
      return res.status(200).json({
        success: false,
        message: "User not found!"
      });
    }
  }
};

exports.SaveMemberApproved  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  if(req.body.member_id === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter member id!"
    });
  }else if(req.body.register_member_id === "") {
    return res.status(200).json({
      success: false,
      message: "Please enter register member id!"
    });
  }else if(req.body.status === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter status!"
    });
  }else{
    let userDetails = await MemberApprovalModel.findOne({ where: {member_id: req.body.member_id, register_member_id: req.body.register_member_id}}).catch(errorHandler);

    if(userDetails === null){
      try {
        const userInsertDetails = await MemberApprovalModel.create(req.body).catch(errorHandler);
        return res.status(200).json({
          success: true,
          result: userInsertDetails,
        });
      } catch (error) {
        return res.status(200).json({
          success: false,
          error: error
        });
      }
    }else{
      return res.status(200).json({
        success: false,
        message: "User already approved!"
      });
    }
  }
};

exports.UserDetails  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  if(req.params.user_id === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter user id!"
    });
  }else{
    let userDetails = await MemberModel.findOne({ where: {id: req.params.user_id}}).catch(errorHandler);
    // let memberApprovalList = await MemberApprovalModel.findAll({ where: {member_id: req.params.user_id}}).catch(errorHandler);
    const memberApprovalList = await sequelize.query(`SELECT ml.* FROM member_approval_list mal 
        INNER JOIN member_list ml ON mal.register_member_id=ml.id
        WHERE mal.member_id = ${req.params.user_id};`, { type: QueryTypes.SELECT });


    if(userDetails !== null){

      return res.status(200).json({
        success: true,
        result: userDetails,
        approval_list: memberApprovalList
      });
    }else{
      return res.status(200).json({
        success: false,
        message: "User not found!"
      });
    }
  }
};

exports.UserListForApproved  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  if(req.body.user_id === "") {
    return res.status(200).json({
      success: false,
      message: "Please enter user id!"
    });
  }else  if(req.body.session === ""){
      return res.status(200).json({
        success: false,
        message: "Please enter session!"
      });
  }else{
    // let userList = await MemberModel.findAll({ where: {session: req.body.session,admin_approval: 0 }}).catch(errorHandler);
    const userList = await sequelize.query(`SELECT * FROM member_list ml 
          WHERE ml.session = '${req.body.session}' AND ml.id!=${req.body.user_id} AND ml.admin_approval = 0 
          AND id NOT IN (SELECT member_id FROM member_approval_list WHERE register_member_id = ${req.body.user_id});`, { type: QueryTypes.SELECT });

    if(userList){
      return res.status(200).json({
        success: true,
        result: userList,
      });
    }else{
      return res.status(200).json({
        success: false,
        message: "User not found!"
      });
    }
  }
};

exports.ApprovedListForUser  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  if(req.body.user_id === "") {
    return res.status(200).json({
      success: false,
      message: "Please enter user id!"
    });
  }else  if(req.body.session === ""){
      return res.status(200).json({
        success: false,
        message: "Please enter session!"
      });
  }else{
    // let userList = await MemberModel.findAll({ where: {session: req.body.session,admin_approval: 0 }}).catch(errorHandler);
    const userList = await sequelize.query(`SELECT * FROM member_list ml 
          WHERE ml.session = '${req.body.session}' AND ml.id!=${req.body.user_id} 
          AND id NOT IN (SELECT member_id FROM member_approval_list WHERE register_member_id = ${req.body.user_id});`, { type: QueryTypes.SELECT });

    if(userList){
      return res.status(200).json({
        success: true,
        result: userList,
      });
    }else{
      return res.status(200).json({
        success: false,
        message: "User not found!"
      });
    }
  }
};

exports.MemberList  = async (req, res, next) => {
  let query = ` WHERE status = 1 AND admin_approval = 1 `
  const name = req.query.name
  const mobile_number = req.query.mobile_number
  const membership_number = req.query.membership_number
  if(name){query = query + ` and name like '${name}' `}
  if(mobile_number){query = query + ` and phone_number like '${mobile_number}' `}
  if(membership_number){query = query + ` and membership_number like '${membership_number}' `}
  const userList = await sequelize.query(`SELECT el.* FROM member_list el ${query};`, { type: QueryTypes.SELECT });

  if(userList){
    return res.status(200).json({
      success: true,
      result: userList,
    });
  }else{
    return res.status(200).json({
      success: false,
      message: "User not found!"
    });
  }

};

exports.CategoryList  = async (req, res, next) => {
  const category_list = await sequelize.query(`SELECT * FROM category_list WHERE status = 1;`, { type: QueryTypes.SELECT });
  if(category_list){
    return res.status(200).json({
      success: true,
      result: category_list,
    });
  }else{
    return res.status(200).json({
      success: false,
      message: "Category not found!"
    });
  }
};
