/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

module.exports = function(router, db) {
  router.post("/login/:id", (req, res) => {
    db.getUserWithId(req.params.id)
      .then(user => {
        if (user.length <= 0) {
          return res.status(400).send('User doesnt exist. Go <a href="/">Back</a>');
        }

        //req.session.role_id = user.role_id;
        req.session.user_id = user.id;
        console.log(req.session);

        //if customer
        if (user.role_id === 1) {
          return res.redirect('/foods');
        }

        //if owner/staff goes to orders
        res.redirect('/orders');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/foods');
  });

  return router;
};
