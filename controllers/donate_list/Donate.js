const {sequelize} = require("../../models");
const {QueryTypes} = require("sequelize");
const CommonFunction = require("../common_function");

exports.list = (req, res, next) => {
  res.render('donate_list/index', {})
};

exports.data_list = async (req, res, next) => {
  let offset = req.body.start;
  let limit = req.body.length;

  const query_data = await sequelize.query(`SELECT * FROM donation_list ORDER BY id DESC LIMIT ${offset}, ${limit};`, { type: QueryTypes.SELECT });
  const query_data_count = await sequelize.query(`SELECT COUNT(*) AS num_of_row FROM donation_list;`, { type: QueryTypes.SELECT });
  let num_of_rows = query_data_count[0].num_of_row;

  if(query_data.length !== 0){
    return res.status(200).json({
      success: true,
      recordsTotal: query_data.length,
      recordsFiltered: num_of_rows,
      data: query_data
    });
  }else{
    return res.status(200).json({
      success: true,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: query_data
    });
  }
};
