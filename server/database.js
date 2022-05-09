// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const pool = new Pool(dbParams);

/// HELPER FUNCTIONS

// const getTime

module.exports = {
  /// ORDERS

  getAllOrdersNotPickedUp: () => {
    const queryString = `
      SELECT orders.id as order_id, users.id as user_id, users.name, is_paid, is_notified, is_ready, is_complete, created_date, pickup_time
      FROM orders
      JOIN users ON orders.user_id = users.id
      WHERE is_complete='false';
    `;

    return pool
      .query(queryString)
      .then(res => {
        console.log(res.rows);
        return res.rows || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  }
};
