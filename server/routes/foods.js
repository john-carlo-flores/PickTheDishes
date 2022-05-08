/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT foods.*, categories.name as category
    FROM foods
      JOIN categories ON categories.id = category_id;`;
    // console.log(query);
    db.query(query)
      .then(data => {
        const foods = data.rows;

        // get category from data
        const categories = [];
        for (let food of foods) {
          if (!categories.includes(food.category)) {
            categories.push(food.category)
          }
        }

        // !!!!!!! need to work on roles_id !!!!!!!!!
        const templateVars = { foods: foods, categories: categories, roles_id: 2 };
        res.render("foods", templateVars);
        // res.json({ foods });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
