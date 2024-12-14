const SSLCommerzPayment = require('sslcommerz-lts')
const {sequelize, DonationModel, MemberShipPaymentModel, EventRegisterModel, MemberModel} = require("../models");
const {QueryTypes} = require("sequelize");
const store_id = 'financealumniassociationorg0live'
const store_passwd = '65F1FFFBC182773077'
const is_live = true //true for live, false for sandbox


exports.sslPaymentMembership = async (req, res, next) => {
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

    const eventRegisterInsert = await MemberShipPaymentModel.create(insertData);
    if(eventRegisterInsert){
      const data = {
        total_amount: req.body.pay_amount,
        currency: 'BDT',
        tran_id: eventRegisterInsert.id,
        success_url: `https://faa-dubd.org/payment/success`,
        fail_url: `https://faa-dubd.org/payment/fail`,
        cancel_url: `https://faa-dubd.org/payment/cancel`,
        ipn_url: `https://faa-dubd.org/payment/ipn_url`,
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
        value_a: "membership",
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
      message: "Server Error !",
      error: error
    });
  }
};

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
        success_url: `https://faa-dubd.org/payment/success`,
        fail_url: `https://faa-dubd.org/payment/fail`,
        cancel_url: `https://faa-dubd.org/payment/cancel`,
        ipn_url: `https://faa-dubd.org/payment/ipn_url`,
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
  // console.log(req.body)
  try {
    if(req.body.status){
      let updateData = {}
      if(req.body.status === "VALID"){
        updateData = {
          is_pay: 1,
          tx_status: req.body.status,
          tx_tran_date: req.body.tran_date,
          tx_tran_id: req.body.tran_id,
          tx_val_id: req.body.val_id,
          tx_amount: req.body.amount,
          tx_store_amount: req.body.store_amount,
          tx_bank_tran_id: req.body.bank_tran_id,
          payment_type: req.body.card_issuer,
          card_brand: req.body.card_brand,
          card_no: req.body.card_no,
          tx_json_response: JSON.stringify(req.body)
        }
      }else{
        updateData = {
          tx_status: req.body.status,
          tx_tran_date: req.body.tran_date,
          tx_tran_id: req.body.tran_id,
          tx_amount: req.body.amount,
          tx_store_amount: req.body.store_amount,
          tx_bank_tran_id: req.body.bank_tran_id,
          payment_type: req.body.card_issuer,
          card_brand: req.body.card_brand,
          card_no: req.body.card_no,
          tx_json_response: JSON.stringify(req.body)
        }
      }
      let update_date = null;
      if(req.body.value_a === "event"){
        update_date = await EventRegisterModel.update(updateData, {where: {id: req.body.tran_id}});
      }else if(req.body.value_a === "membership"){
        update_date = await MemberShipPaymentModel.update(updateData, {where: {id: req.body.tran_id}});
        const update_member_date = await MemberModel.update({is_pay: 1,amount:  req.body.amount}, {where: {id: req.body.value_b}});
      }else{
        update_date = await DonationModel.update(updateData, {where: {id: req.body.tran_id}});
      }

      if(update_date){
        console.log(req.body.status)
        if(req.body.status === "VALID"){
          return res.redirect(`https://faa-dubd.org/success/${req.body.tran_id}`);
        }else if(req.body.status === "FAILED"){
          // return res.redirect(`https://faa-dubd.org/fail/${req.body.tran_id}`);
        }else if(req.body.status === "CANCELLED"){
          return res.redirect(`https://faa-dubd.org/cancel/${req.body.tran_id}`);
        }else if(req.body.status === "UNATTEMPTED"){
          return res.redirect(`https://faa-dubd.org/fail/${req.body.tran_id}`);
        }else if(req.body.status === "EXPIRED"){
          return res.redirect(`https://faa-dubd.org/fail/${req.body.tran_id}`);
        }
      }
    }else{
      return res.redirect(`https://faa-dubd.org/fail/${req.body.tran_id}`);
    }
  } catch (error) {
    console.log(error)
    return res.redirect(`https://faa-dubd.org/fail/${req.body.tran_id}`);
  }

  // const data = {
  //   val_id: req.body.val_id,
  // };
  // const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
  // sslcz.validate(data).then(async data => {
  //   try {
  //     const dataDetails = await DonationModel.findOne({where: {id: req.query.tr_id}});
  //     if(!dataDetails.tx_status){
  //       const updateData = {
  //         tx_status: data.status,
  //         tx_tran_date: data.tran_date,
  //         tx_tran_id: data.tran_id,
  //         tx_val_id: data.val_id,
  //         tx_amount: data.amount,
  //         tx_store_amount: data.store_amount,
  //         tx_bank_tran_id: data.bank_tran_id,
  //         tx_json_response: JSON.stringify(data)
  //       }
  //       const update_date = await DonationModel.update(updateData, {where: {id: req.query.tr_id}});
  //       if(update_date){
  //         if(req.query.type === "success"){
  //           return res.redirect(`${req.query.return_url}/success/${req.query.tr_id}`);
  //         }else if(req.query.type === "fail"){
  //           return res.redirect(`${req.query.return_url}/fail/${req.query.tr_id}`);
  //         }else if(req.query.type === "cancel"){
  //           return res.redirect(`${req.query.return_url}/cancel/${req.query.tr_id}`);
  //         }else{
  //           return res.redirect(`${req.query.return_url}/cancel/${req.query.tr_id}`);
  //         }
  //       }
  //     }else{
  //       return res.redirect(`${req.query.return_url}/cancel/${req.query.tr_id}`);
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     return res.redirect(`${req.query.return_url}/cancel/${req.query.tr_id}`);
  //   }
  // });
}

exports.sslPaymentStatus = async (req, res, next) => {
  if (req.query.tr_id) {
    const dataDetails = await DonationModel.findOne({where: {id: req.query.tr_id}});
    if(dataDetails){
      return res.status(200).json({
        success: true,
        result: dataDetails,
      });
    }else{
      return res.status(200).json({
        success: true,
        message: "Data not found",
      });
    }
  }else{
    return res.status(200).json({
      success: true,
      message: "tr_id is empty",
    });
  }
}
