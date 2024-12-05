const { sequelize } = require("../models");
const { QueryTypes } = require('sequelize');

exports.participantDetails = async (req, res, next) => {
  const id = req.query.id;

  try {
    // Fetch participant details using raw query
    const [participant] = await sequelize.query(
      `SELECT 
        er.id, 
        er.event_id,
        e.event_title,
        e.event_date,
        e.event_venue, 
        er.full_name, 
        er.email_address,
        er.phone_number,
        er.t_shirt_size,
        er.delivery_option,
        er.is_outside_dhaka,
        er.delivery_charge,
        er.delivery_address,
        er.tx_tran_date, 
        er.payment_type, 
        er.tx_status, 
        er.pay_amount, 
        er.participation_type,
        er.enter_date_time,
        er.is_pay
      FROM event_register er 
      INNER JOIN event_list e ON er.event_id = e.id 
      WHERE er.id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!participant) {
      // Record not found
      return res.render('enter_event', {
        layout: false,
        title: 'Event Entry',
        message: 'You are not registered for this event.',
        participant: null,
        showEnterButton: false,
      });
    }

    let message = '';
    let showEnterButton = false;

    if (participant.is_pay === 1) {
      if (!participant.enter_date_time) {
        // User has paid but not entered
        message = 'You have paid for this event. Click the button to enter.';
        showEnterButton = true;
      } else {
        // User has paid and already entered
        message = 'You have already entered this event.';
      }
    } else {
      // User has not paid
      message = 'You have not paid for this event.';
    }

    res.render('enter_event', {
      layout: false,
      title: 'Event Entry',
      message,
      participant,
      showEnterButton,
    });
  } catch (error) {
    next(error);
  }
};

// Update `enter_date_time` with raw query
exports.updateEnterDateTime = async (req, res, next) => {
  const id = req.body.id;

  try {
    const [result] = await sequelize.query(
      `UPDATE event_register 
       SET enter_date_time = NOW() 
       WHERE id = :id`,
      {
        replacements: { id },
        type: sequelize.QueryTypes.UPDATE,
      }
    );

    if (result === 0) {
      return res.json({ success: false, message: 'Failed to update entry. Participant not found.' });
    }

    res.json({ success: true, message: 'Successfully entered the event.' });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: 'Failed to enter the event.' });
  }
};

