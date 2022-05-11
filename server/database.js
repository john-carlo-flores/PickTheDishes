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

  updateOrderStateAndPickupTimeById: (id, state, pickupTime) => {
    const queryString = `
      UPDATE orders
      SET ${state} = 'true', pickup_time = $1
      WHERE id = $2
    `;

    return pool
      .query(queryString, [pickupTime, id])
      .catch(err => {
        console.log('Error:', err.stack);
      });
  },

  updateOrderStateById: (id, state) => {
    const queryString = `
      UPDATE orders
      SET ${state} = 'true'
      WHERE id = $1
    `;

    return pool
      .query(queryString, [id])
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
        return res.rows[0] || null;
      })
      .catch(err => {
        console.log('Error:', err.stack);
      });
  },

  sendFoodWithId: (orderArr, order_id) => {
    let queryString;
    for (const order of orderArr) {
      let string = `INSERT INTO food_orders (food_id, order_id, quantity)
      VALUES (${order.id}, ${order_id},${order.quantity});
      `
      queryString += string;
    }
    return pool
      .query(queryString);
  },

  // send order to the database after checkout
  sendOrder: (user_id, orderArr) => {
    return pool
      .query(`INSERT INTO orders (user_id, is_paid)
      VALUES ($1, $2)
      RETURNING *
      `, [user_id, 'true'])   //returning : passed to query data & generated data
      .then(res => {
        const order_id = res.rows[0].id
        let queryString = `INSERT INTO food_orders (food_id, order_id, quantity)
        VALUES `;

        for (let i = 0; i < orderArr.length - 1; i++ ) {
          let string = `(${orderArr[i].id}, ${order_id},${orderArr[i].quantity}), `
          queryString += string;
        }
        const last = orderArr.length - 1;
        queryString += `(${orderArr[last].id}, ${order_id},${orderArr[last].quantity});`
        console.log(queryString);
        return pool.query(queryString);
      })
      .catch(err => {
        console.log('Error: ', err.stack);
      })
  }



};


