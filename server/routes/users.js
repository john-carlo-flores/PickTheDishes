/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const { render } = require("express/lib/response");

module.exports = function(router, db) {

  // router.post("/login", (req, res) => {
  //   const user_id = req.body.id
  //   req.session.user_id = Number(user_id);
  //   console.log('user_id: ', user_id);
  //   res.redirect(`/users/login/${user_id}`);
  //   });


  router.post("/login", (req, res) => {
    // console.log('req.params.id: ', req.params.id);
    // const id = req.params.id;
    // console.log(id);
    const user_id = req.body.user_id;
    req.session.user_id = user_id;
    db.getUserWithId(user_id)
      .then(user => {
        console.log(user);
        if (!user) {
          return res.status(400).send('User doesnt exist. Go <a href="/">Back</a>');
        }

        //req.session.role_id = user.role_id;
        // req.session.user_id = user.id;
        console.log(req.session);
        console.log(user.role_id);
        //if customer
        if (user.role_id === 1) {
          return res.redirect('/foods');
        }

        //if owner/staff goes to orders
        return res.redirect('/orders');
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
