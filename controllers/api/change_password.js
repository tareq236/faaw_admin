const { MemberModel } = require("../../models");

exports.changePassword = async (req, res, next) => {
    const errorHandler = (err) => {
      return res.status(200).json({
        success: false,
        message: err.original.sqlMessage
      });
    };

    let validation = false;
    if(req.body.current_password === ""){
      return res.status(200).json({
        success: false,
        message: "Current password empty "
      });
    }else if(req.body.new_password === ""){
      return res.status(200).json({
        success: false,
        message: "New password empty "
      });
    }else if(req.body.current_password !== "" && req.body.new_password !== ""){
      validation=true
    }
    if(validation){
      let result = await MemberModel.findOne({ where: {id: req.body.member_id} }).catch(errorHandler);

      if(result){
        if(result.password === req.body.current_password){
          if(req.body.new_password === req.body.confirm_password){
            let update_data = {
              password: req.body.new_password,
            };
            const update_date = await MemberModel.update(update_data,{ where: { id: req.body.member_id } }).catch(errorHandler);
            return res.status(200).json({
              success: false,
              message: "Password update successfully! "
            });
          }else{
            return res.status(200).json({
              success: false,
              message: "Confirm password not match "
            });
          }
        }else{
          return res.status(200).json({
            success: false,
            message: "Current password not correct "
          });
        }
      }else{
        return res.status(200).json({
          success: false,
          message: "Member not found "
        });
      }
    }
  };
