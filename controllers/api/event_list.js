const { sequelize, EventRegisterModel} = require("../../models");
const { QueryTypes } = require('sequelize');

exports.Details = async (req, res, next) => {
  const _data = await sequelize.query(`SELECT el.* FROM event_list el WHERE status = 1 AND id=${req.params.id} ORDER BY el.id;`, { type: QueryTypes.SELECT });

  return res.status(200).json({
    success: true,
    result: _data,
  });

};


exports.Save  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  let eventDetails = await EventRegisterModel.findOne({ where: {event_id: req.body.event_id, email: req.body.email}}).catch(errorHandler);

  if(eventDetails === null){
    try {
      const eventRegisterInsert = await EventRegisterModel.create(req.body).catch(errorHandler);
      return res.status(200).json({
        success: true,
        result: eventRegisterInsert,
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
      message: "Already event registered !"
    });
  }

};


exports.List = async (req, res, next) => {
  const _data = await sequelize.query(`SELECT el.* FROM event_list el WHERE status = 1 ORDER BY el.id;`, { type: QueryTypes.SELECT });

  return res.status(200).json({
    success: true,
    result: _data,
  });

};
