//controllers/event_registration/EventRegistration.js
const { sequelize, EventModel, EventRegisterModel} = require("../../models");
const { QueryTypes } = require('sequelize');
const XLSX = require('xlsx');  // Import the xlsx library
const fs = require('fs');
const path = require('path');

exports.list = (req, res, next) => {
  res.render('event_registration/index', { })
};

exports.getEventRegistrations = async (req, res) => {
  try {
    // Get the request parameters from DataTable
    const { start, length, search, order, event, member_type, tx_status } = req.query;

    // Build query with filtering, pagination, and sorting
    let query = `
      SELECT 
        er.id,
        er.event_id,
        er.full_name,
        er.member_type,
        er.participation_type,
        er.pay_amount,
        er.tx_status,
        er.payment_type,
        er.enter_date_time,
        e.event_title
      FROM event_register er
      INNER JOIN event_list e ON er.event_id = e.id
      WHERE 1=1
    `;

    // Apply search filter
    if (search && search.value) {
      const searchTerm = search.value;
      query += ` AND (
        er.full_name LIKE '%${searchTerm}%' OR
        e.event_title LIKE '%${searchTerm}%' OR
        er.member_type LIKE '%${searchTerm}%'
      )`;
    }

    // Apply event filter if provided
    if (event) {
      query += ` AND er.event_id = :event`;
    }

    // Apply member_type filter if provided
    if (member_type) {
      query += ` AND er.member_category_id = :member_type`;
    }

    // Apply tx_status filter if provided
    if (tx_status) {
      query += ` AND er.is_pay = :tx_status`;
    }

    // Apply sorting
    if (order && order[0]) {
      const columnIndex = order[0].column;
      const columnOrder = order[0].dir;
      const columnNames = ['id', 'event_title', 'full_name', 'member_type', 'participation_type', 'pay_amount', 'tx_status', 'payment_type', 'enter_date_time'];
      const orderByColumn = columnNames[columnIndex];
      query += ` ORDER BY ${orderByColumn} ${columnOrder}`;
    }

    // Apply pagination
    const limit = parseInt(length) || 10;
    const offset = parseInt(start) || 0;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    // Define replacements for filters
    const replacements = {
      event,
      member_type,
      tx_status
    };

    // Execute the query
    const registrations = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) AS total FROM event_register er
      INNER JOIN event_list e ON er.event_id = e.id
      WHERE 1=1
    `;
    // Apply filters to count query
    if (search && search.value) {
      const searchTerm = search.value;
      countQuery += ` AND (
        er.full_name LIKE '%${searchTerm}%' OR
        e.event_title LIKE '%${searchTerm}%' OR
        er.member_type LIKE '%${searchTerm}%'
      )`;
    }

    if (event) {
      countQuery += ` AND er.event_id = :event`;
    }

    if (member_type) {
      countQuery += ` AND er.member_category_id = :member_type`;
    }

    if (tx_status) {
      countQuery += ` AND er.is_pay = :tx_status`;
    }

    const [totalCountResult] = await sequelize.query(countQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    const totalRecords = totalCountResult.total;

    // Return data in the format DataTable expects
    res.json({
      draw: req.query.draw,
      recordsTotal: totalRecords,
      recordsFiltered: totalRecords, // Here, you may want to adjust this to reflect filtered records
      data: registrations
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    const { event, member_type, tx_status } = req.query;

    // Build the query for fetching the data
    let query = `
      SELECT 
        er.id,
        er.event_id,
        er.full_name,
        er.member_id,
        er.student_id,
        er.session,
        er.organization_name,
        er.email_address,
        er.phone_number,
        er.t_shirt_size,
        er.delivery_option,
        er.delivery_address,
        er.is_pay,
        er.tx_tran_date,
        er.tx_tran_id,
        er.tx_val_id,
        er.tx_amount,
        er.tx_bank_tran_id,
        er.email_status,
        er.member_type,
        er.participation_type,
        er.pay_amount,
        er.tx_status,
        er.payment_type,
        er.enter_date_time,
        e.event_title
      FROM event_register er
      INNER JOIN event_list e ON er.event_id = e.id
      WHERE 1=1
    `;

    // Apply filters if provided
    if (event) query += ` AND er.event_id = :event`;
    if (member_type) query += ` AND er.member_category_id = :member_type`;
    if (tx_status) query += ` AND er.is_pay = :tx_status`;

    const replacements = { event, member_type, tx_status };

    // Fetch the data
    const registrations = await sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Convert the result to a format suitable for Excel
    const formattedData = registrations.map(reg => ({
      'Event ID': reg.event_id,
      'Event Title': reg.event_title,
      'Full Name': reg.full_name,
      'Member ID': reg.member_id,
      'Student ID': reg.student_id,
      'Session': reg.session,
      'Organization Name': reg.organization_name,
      'Email Address': reg.email_address,
      'Phone Number': reg.phone_number,
      'T-Shirt Size': reg.t_shirt_size,
      'Delivery Option': reg.delivery_option,
      'Delivery Address': reg.delivery_address,
      'Is Paid': reg.is_pay === 1 ? 'Yes' : 'No',
      'Transaction Date': reg.tx_tran_date,
      'Transaction ID': reg.tx_tran_id,
      'Transaction Validation ID': reg.tx_val_id,
      'Transaction Amount': reg.tx_amount,
      'Bank Transaction ID': reg.tx_bank_tran_id,
      'Email Status': reg.email_status,
      'Member Type': reg.member_type,
      'Participation Type': reg.participation_type,
      'Pay Amount': reg.pay_amount,
      'Transaction Status': reg.tx_status === 1 ? 'Paid' : 'Unpaid',
      'Payment Type': reg.payment_type,
      'Enter Date Time': reg.enter_date_time
    }));

    // Create a new workbook and add the data
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Event Registrations");

    // Generate a file path to save the Excel file
    const filePath = path.join(__dirname, "../../public/temp/event_registrations.xlsx");

    // Write the Excel file to the server
    XLSX.writeFile(wb, filePath);

    // Send the file as a response
    res.download(filePath, 'event_registrations.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('Internal Server Error');
      } else {
        // Optionally delete the file after download
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    });
  } catch (error) {
    console.error('Error exporting Excel file:', error);
    res.status(500).send('Internal Server Error');
  }
};
