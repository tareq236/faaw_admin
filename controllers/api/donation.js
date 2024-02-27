const {DonationModel} = require("../../models");


exports.Save  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  let eventDetails = await DonationModel.findOne({ where: {email_address: req.body.email_address}}).catch(errorHandler);

  if(eventDetails === null){
    try {
      const eventRegisterInsert = await DonationModel.create(req.body).catch(errorHandler);
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
