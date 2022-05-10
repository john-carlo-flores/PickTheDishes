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
    db.getFoodsWithCategories()
      .then(foods => {
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

  // click the food list, pop up modal and show only clicked food info
  router.get("/:id", (req, res) => {
    console.log(req.params.id);

    db.getFoodDetailsWithId(req.params.id)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // add food to the cart if add button clicked
  router.post("/", (req, res) => {
    console.log(req.body);
  })

  return router;
};
