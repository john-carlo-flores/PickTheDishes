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
        return res.rows || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  },

  updateOrderStateById: (id, state) => {
    const queryString = `
      UPDATE orders
      SET $1 = 'true'
      WHERE id = $2
      RETURNING *
    `;

    return pool
      .query(queryString, [state, id])
      .then(res => {
        return res.rows || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  },

  /// FOODS

  getFoodsWithCategories: () => {
    let queryString = `SELECT foods.*, categories.name as category
    FROM foods
    JOIN categories ON categories.id = category_id;`;

    return pool
      .query(queryString)
      .then(res => {
        const foods = res.rows;
        return foods || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  },

  getFoodDetailsWithId: (id) => {
    let queryString = `
      SELECT foods.*, categories.name as category
      FROM foods
      JOIN categories ON categories.id = category_id
      WHERE foods.id = $1;`;

    return pool
      .query(queryString, [id])
      .then(res => {
        return res.rows[0] || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  },

  /// USERS

  getUserWithId: (id) => {
    return pool
      .query(`SELECT * FROM users WHERE id = $1;`, [id])
      .then(res => {
        return res.rows || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  }
};
