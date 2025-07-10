const { sequelize } = require("../../models");
const { QueryTypes } = require('sequelize');
const XLSX = require('xlsx');

exports.list = (req, res) => {
  res.render('collection_of_payments/index');
};

exports.getCollectionOfPayments = async (req, res) => {
  const draw = req.query.draw;
  const start = parseInt(req.query.start) || 0;
  const length = parseInt(req.query.length) || 10;
  const source_type = req.query.source_type || '';
  const searchValue = req.query.search?.value || '';
  const start_date = req.query.start_date || '';
  const end_date = req.query.end_date || '';

  // Build dynamic WHERE clause
  let whereConditions = [];
  if (source_type) {
    whereConditions.push(`source = '${source_type}'`);
  }
  if (start_date) {
    whereConditions.push(`DATE(created_at) >= '${start_date}'`);
  }
  if (end_date) {
    whereConditions.push(`DATE(created_at) <= '${end_date}'`);
  }
  if (searchValue) {
    whereConditions.push(`phone_number LIKE '%${searchValue}%'`);
  }
  let whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

  // Main query with filters
  const baseQuery = `
    SELECT * FROM (
      SELECT
        'Event' AS source,
        er.member_id,
        er.student_id,
        er.full_name AS name,
        er.organization_name,
        er.session,
        er.member_type,
        er.phone_number,
        er.email_address,
        er.pay_amount,
        er.created_at
      FROM event_register er 
      INNER JOIN event_list el ON er.event_id = el.id
      WHERE er.is_pay = 1

      UNION ALL

      SELECT 
        'Membership Payment' AS source,
        msp.member_id,
        NULL AS student_id,
        msp.name,
        msp.organization_name,
        NULL AS session,
        NULL AS member_type,
        msp.phone_number,
        msp.email_address,
        msp.pay_amount,
        msp.created_at
      FROM member_ship_payments msp
      WHERE msp.tx_status = 'VALID'

      UNION ALL

      SELECT 
        'Donation' AS source,
        NULL AS member_id,
        NULL AS student_id,
        dl.name,
        dl.organization_name,
        NULL AS session,
        NULL AS member_type,
        dl.phone_number,
        dl.email_address,
        dl.pay_amount,
        dl.created_at
      FROM donation_list dl
      WHERE dl.tx_status = 'VALID'
    ) AS combined
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${length} OFFSET ${start};
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM (
      SELECT 
        el.event_title AS source,
        er.member_id,
        er.student_id,
        er.full_name AS name,
        er.organization_name,
        er.session,
        er.member_type,
        er.phone_number,
        er.email_address,
        er.pay_amount,
        er.created_at
      FROM event_register er 
      INNER JOIN event_list el ON er.event_id = el.id
      WHERE er.is_pay = 1

      UNION ALL

      SELECT 
        'Membership Payment' AS source,
        msp.member_id,
        NULL AS student_id,
        msp.name,
        msp.organization_name,
        NULL AS session,
        NULL AS member_type,
        msp.phone_number,
        msp.email_address,
        msp.pay_amount,
        msp.created_at
      FROM member_ship_payments msp
      WHERE msp.tx_status = 'VALID'

      UNION ALL

      SELECT 
        'Donation' AS source,
        NULL AS member_id,
        NULL AS student_id,
        dl.name,
        dl.organization_name,
        NULL AS session,
        NULL AS member_type,
        dl.phone_number,
        dl.email_address,
        dl.pay_amount,
        dl.created_at
      FROM donation_list dl
      WHERE dl.tx_status = 'VALID'
    ) AS combined
    ${whereClause};
  `;

  try {
    const data = await sequelize.query(baseQuery, { type: QueryTypes.SELECT });
    const total = await sequelize.query(countQuery, { type: QueryTypes.SELECT });

    res.json({
      draw,
      recordsTotal: total[0].total,
      recordsFiltered: total[0].total,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.downloadExcel = async (req, res) => {
  const source_type = req.query.source_type || '';
  const start_date = req.query.start_date || '';
  const end_date = req.query.end_date || '';

  // Build filter
  let whereConditions = [];
  if (source_type) {
    whereConditions.push(`source = '${source_type}'`);
  }
  if (start_date) {
    whereConditions.push(`DATE(created_at) >= '${start_date}'`);
  }
  if (end_date) {
    whereConditions.push(`DATE(created_at) <= '${end_date}'`);
  }
  let whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

  const excelQuery = `
    SELECT * FROM (
      SELECT
        'Event' AS source,
        er.member_id,
        er.student_id,
        er.full_name AS name,
        er.organization_name,
        er.session,
        er.member_type,
        er.phone_number,
        er.email_address,
        er.pay_amount,
        er.created_at
      FROM event_register er 
      INNER JOIN event_list el ON er.event_id = el.id
      WHERE er.is_pay = 1

      UNION ALL

      SELECT 
        'Membership Payment' AS source,
        msp.member_id,
        NULL AS student_id,
        msp.name,
        msp.organization_name,
        NULL AS session,
        NULL AS member_type,
        msp.phone_number,
        msp.email_address,
        msp.pay_amount,
        msp.created_at
      FROM member_ship_payments msp
      WHERE msp.tx_status = 'VALID'

      UNION ALL

      SELECT 
        'Donation' AS source,
        NULL AS member_id,
        NULL AS student_id,
        dl.name,
        dl.organization_name,
        NULL AS session,
        NULL AS member_type,
        dl.phone_number,
        dl.email_address,
        dl.pay_amount,
        dl.created_at
      FROM donation_list dl
      WHERE dl.tx_status = 'VALID'
    ) AS combined
    ${whereClause}
    ORDER BY created_at DESC;
  `;

  try {
    const rows = await sequelize.query(excelQuery, { type: QueryTypes.SELECT });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader('Content-Disposition', 'attachment; filename="collection_of_payments.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating Excel file.');
  }
};
