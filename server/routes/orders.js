/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);
const express = require('express');
const router  = express.Router();
const moment = require('moment');
const sendSMS = require('../send_sms.js');

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.getAllOrdersNotPickedUp()
      .then(orders => {
        const orderStates = ['Pending', 'Preparing', 'Ready for Pickup'];
        reformatOrderDetails(orders);

        const templateVars = { orders, orderStates};
        res.render('orders', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post('/', (req, res) => {
    //Send order sms to restaurant
    db.getUserWithId(req.session.user_id)
      .then(user =>{
        const userName = user.name;
        const message = `${userName} has put in an order! Order ID:`;
        const number = process.env.RESTAURANT_NUMBER;
        sendSMS(message, number);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/prepare", (req, res) => {
    const order_id = Number(req.params.id);
    const state = getUpdateOrderState('Pending');
    let { createdDate, estimatedTime } = req.body;
    createdDate = moment(createdDate, 'YYYY-MM-DD HH:mm:ss');

    const pickupTime = moment(createdDate).add(Number(estimatedTime), 'minutes').format('YYYY-MM-DD HH:mm:ss');

    db.updateOrderStateAndPickupTimeById(order_id, state, pickupTime)
      .then(() => {
        //TODO: Send SMS estimated time to user
        const message = `Estimated time for you order: ${estimatedTime} mins`;
        const number = process.env.USER_NUMBER;
        res.send(`${estimatedTime} mins`);
        sendSMS(message, number);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/ready", (req, res) => {
    const order_id = Number(req.params.id);
    const state = getUpdateOrderState('Preparing');

    console.log("/:id/ready", state);

    db.updateOrderStateById(order_id, state)
      .then(() => {
        //TODO: Send order ready for pickup to user
        const number = process.env.USER_NUMBER;
        const message = 'Your order is ready for pickup!';
        sendSMS(message, number);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

const reformatOrderDetails = (orders) => {
  for (const order in orders) {
    //Format: Dates => Time Only
    orders[order].remaining_time = moment(orders[order].pickup_time).diff(moment(orders[order].created_date), 'minutes');
    orders[order].start_time = moment(orders[order].created_date).format('hh:mm A');
    orders[order].created_date = moment(orders[order].created_date).format('YYYY-MM-DD HH:mm:ss');

    if (orders[order].pickup_time) {
      orders[order].pickup_time = moment(orders[order].pickup_time);
    }

    //Format: Shortened Name
    const names = orders[order].name.split(' ');
    orders[order].abbrev_name = `${names[0]} ${names[1][0]}.`;

    setOrderState(orders[order]);
  }
};

const setOrderState = (order) => {
  if (order.is_paid && !order.is_notified) return order.state = 'pending';
  if (order.is_notified && !order.is_ready) return order.state = 'preparing';
  if (order.is_ready && !order.is_complete) return order.state = 'ready for pickup';
};

const getUpdateOrderState = (currentState) => {
  switch (currentState) {
    case 'Pending':
      return 'is_notified';
    case 'Preparing':
      return 'is_ready';
    case 'Ready for Pickup':
      return 'is_complete';
  }
};
