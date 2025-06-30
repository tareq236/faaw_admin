const { sequelize, EventRegisterModel, EventSponsorModel, DonationModel} = require("../../models");
const { QueryTypes } = require('sequelize');
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = 'financealumniassociationorg0live'
const store_passwd = '65F1FFFBC182773077'
const is_live = true //true for live, false for sandbox

exports.EventSponsorSave  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  let eventDetails = await EventSponsorModel.findOne({ where: {event_id: req.body.event_id, email: req.body.email}}).catch(errorHandler);

  if(eventDetails === null){
    try {
      const eventRegisterInsert = await EventSponsorModel.create(req.body).catch(errorHandler);
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

exports.Details = async (req, res, next) => {
  const _data = await sequelize.query(`SELECT el.* FROM event_list el WHERE status = 1 AND id=${req.params.id};`, { type: QueryTypes.SELECT });
  const _media_data = await sequelize.query(`SELECT * FROM event_image_list WHERE event_id = ${req.params.id};`, { type: QueryTypes.SELECT });

  return res.status(200).json({
    success: true,
    result: _data,
    media: _media_data,
  });

};

exports.Save  = async (req, res, next) => {
  const errorHandler = (err) => {
    return res.status(200).json({
      success: false,
      error: err
    });
  };

  let eventDetails = await EventRegisterModel.findOne({ where: {event_id: req.body.event_id, email_address: req.body.email_address, is_pay: 1}}).catch(errorHandler);

  if(eventDetails === null){
    try {
      const eventRegisterInsert = await EventRegisterModel.create(req.body).catch(errorHandler);
      // return res.status(200).json({
      //   success: true,
      //   result: eventRegisterInsert,
      // });
      if(eventRegisterInsert){
        const data = {
          total_amount: req.body.pay_amount,
          currency: 'BDT',
          tran_id: eventRegisterInsert.id,
          success_url: `https://faa-dubd.org/payment/success`,
          fail_url: `https://faa-dubd.org/payment/fail`,
          cancel_url: `https://faa-dubd.org/payment/cancel`,
          ipn_url: `https://faa-dubd.org/payment/ipn_url`,
          // success_url: `http://localhost:3000/payment/success`,
          // fail_url: `http://localhost:3000/payment/fail`,
          // cancel_url: `http://localhost:3000/payment/cancel`,
          // ipn_url: `http://localhost:3000/payment/ipn_url`,
          shipping_method: 'Service',
          product_name: 'EventRegistration',
          product_category: 'EventRegistration',
          product_profile: 'general',
          cus_name: req.body.name,
          cus_email: req.body.email_address,
          cus_add1: '',
          cus_add2: '',
          cus_city: '',
          cus_state: '',
          cus_postcode: '',
          cus_country: 'Bangladesh',
          cus_phone: req.body.phone_number,
          cus_fax: '',
          ship_name: req.body.name,
          ship_add1: '',
          ship_add2: '',
          ship_city: '',
          ship_state: '',
          ship_postcode: 1000,
          ship_country: 'Bangladesh',
          value_a: "event",
          value_b: req.body.member_id,
        };
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
        sslcz.init(data).then(apiResponse => {
          // console.log(data)
          // Redirect the user to payment gateway
          let GatewayPageURL = apiResponse.GatewayPageURL
          return res.status(200).json({
            success: true,
            url: GatewayPageURL,
          });
          // res.redirect(GatewayPageURL)
          // console.log('Redirecting to: ', GatewayPageURL)
        });
      }else{
        return res.status(200).json({
          success: false,
          message: "Server Error !"
        });
      }
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
