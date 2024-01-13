const { sequelize, MemberModel } = require("../../models");

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
