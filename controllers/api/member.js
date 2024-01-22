const { sequelize, MemberModel, MemberApprovalModel } = require("../../models");

exports.Save  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  if(req.body.name === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter your name!"
    });
  }else if(req.body.password === "") {
    return res.status(200).json({
      success: false,
      message: "Please enter password!"
    });
  }else if(req.body.phone_number === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter phone number!"
    });
  }else if(req.body.email === ""){
    return res.status(200).json({
      success: false,
      message: "Please enter email!"
    });
  }else{
    let userDetails = await MemberModel.findOne({ where: {email: req.body.email}}).catch(errorHandler);
    if(userDetails === null){
      try {
        const userInsertDetails = await MemberModel.create(req.body).catch(errorHandler);
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
  }
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
    let memberApprovalList = await MemberApprovalModel.findAll({ where: {member_id: req.params.user_id}}).catch(errorHandler);
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
    let userList = await MemberModel.findAll({ where: {session: req.body.session,admin_approval: 0 }}).catch(errorHandler);
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
