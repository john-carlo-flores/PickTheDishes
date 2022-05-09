/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const formatTime = (date) => {

  const options = {
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('en-CA', options).format(date);
}

const formatRemainingTime = (date) => {

  const options = {
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('en-CA', options).format(date);
}

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.getAllOrdersNotPickedUp()
      .then(orders => {
        const orderStates = ['Pending', 'Preparing', 'Ready for Pickup'];

        for (const order in orders) {
          orders[order].remaining_time = formatRemainingTime(Math.abs(orders[order].pickup_time - orders[order].created_date));
          orders[order].created_date = formatTime(orders[order].created_date);

          if (orders[order].pickup_time) {
            orders[order].pickup_time = formatTime(orders[order].pickup_time);
          }
          const names = orders[order].name.split(' ');

          orders[order].abbrev_name = `${names[0]} ${names[1][0]}.`
        }

        const templateVars = { orders, orderStates};
        res.render('orders', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
