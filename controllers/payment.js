const SSLCommerzPayment = require('sslcommerz-lts')
const {sequelize, DonationModel, CategoryModel} = require("../models");
const {QueryTypes} = require("sequelize");
const store_id = 'financealumniassociationorg0live'
const store_passwd = '65F1FFFBC182773077'
const is_live = true //true for live, false for sandbox


exports.sslPayment = async (req, res, next) => {
  try {
    const insertData = {
      member_id: req.body.member_id,
      name: req.body.name,
      organization_name: req.body.organization_name,
      email_address: req.body.email_address,
      phone_number: req.body.phone_number,
      pay_amount: req.body.pay_amount,
      payment_type: "ssl",
    }

    const eventRegisterInsert = await DonationModel.create(insertData);
    if(eventRegisterInsert){
      const data = {
        total_amount: req.body.pay_amount,
        currency: 'BDT',
        tran_id: eventRegisterInsert.id,
        success_url: req.body.return_url + '/success?tr_id=' + eventRegisterInsert.id,
        fail_url: req.body.return_url + '/fail?tr_id=' + eventRegisterInsert.id,
        cancel_url: req.body.return_url + '/cancel?tr_id=' + eventRegisterInsert.id,
        ipn_url: req.body.return_url + '/ipn?tr_id=' + eventRegisterInsert.id,
        shipping_method: 'Service',
        product_name: 'Donation.',
        product_category: 'Donation',
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
      message: "Server Error !",
      error: error
    });
  }
};

exports.sslPaymentValidate = async (req, res, next) => {
  const data = {
    val_id: req.query.tr_id,
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  sslcz.validate(data).then(async data => {
    try {
      const dataDetails = await DonationModel.findOne({where: {id: req.query.tr_id}});
      if(!dataDetails.tx_status){
        const updateData = {
          tx_status: data.status,
          tx_tran_date: data.tran_date,
          tx_tran_id: data.tran_id,
          tx_val_id: data.val_id,
          tx_amount: data.amount,
          tx_store_amount: data.store_amount,
          tx_bank_tran_id: data.bank_tran_id,
          tx_json_response: JSON.stringify(data)
        }
        const update_date = await DonationModel.update(updateData, {where: {id: req.query.tr_id}});
        if(update_date){
          return res.status(200).json({
            success: true,
            result: updateData,
          });
        }
      }else{
        return res.status(200).json({
          success: false,
          message: "Payment already update !",
        });
      }
    } catch (error) {
      console.log(error)
      return res.status(200).json({
        success: false,
        message: "Server Error !",
        error: error
      });
    }

    //process the response that got from sslcommerz
    // https://developer.sslcommerz.com/doc/v4/#order-validation-api
  });
}
