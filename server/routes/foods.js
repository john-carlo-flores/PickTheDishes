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
    let query = `SELECT * FROM foods`;
    console.log(query);
    db.query(query)
      .then(data => {
        const foods = data.rows;
        const templateVars = { foods: foods };
        res.render("url_foods", templateVars);
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
