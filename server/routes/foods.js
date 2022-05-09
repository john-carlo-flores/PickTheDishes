/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const { json } = require('express/lib/response');
const router  = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(req.body);
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
        // use cookies that store roles_id
        const role_id = 2
        const templateVars = { foods: foods, categories: categories, roles_id: role_id };
        // res.header('token', JSON.stringify({ token: 'token' }));

        res.render("foods", templateVars)
        // res.json(foods);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    console.log(req.params.id);
    let query = `SELECT foods.*, categories.name as category
    FROM foods
      JOIN categories ON categories.id = category_id
      WHERE foods.id = $1;`;
    // console.log(query);
    db.query(query,[req.params.id])
      .then(data => {
        const foods = data.rows[0];
        // console.log(foods);
        res.json(foods);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
