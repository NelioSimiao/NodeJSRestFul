let NeDB = require("nedb");
let db = new NeDB({
  filename: "users.db",
  autoload: true
});

const { check, validationResult } = require("express-validator");

module.exports = function(app) {
  let route = app.route("/users");
  //metodo get
  route.get((req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    db.find({})
      .sort({ name: 1 })
      .exec((err, users) => {
        if (err) {
          app.utils.error.send(err, req, res);
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            users: users
          });
        }
      });
  });

  //insere no nedb
  app.post(
    "/users",
    [
      check("_email")
        .isEmail()
        .withMessage("O email não é valido"),
      check("_name")
        .isLength({ min: 5 })
        .withMessage("O nome deve ter no minino")
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      db.insert(req.body, (err, user) => {
        if (err) {
          app.utils.error.send(err, req, res);
        } else {
          res.status(200).json({ user });
        }
      });
    }
  );

  //buscando um apenas
  let routeId = app.route("/users/:id");
  routeId.get((req, res) => {
    db.findOne({ _id: req.params.id }).exec((err, user) => {
      if (err) {
        app.utils.error.send(err, req, res);
      } else {
        res.status(200).json({ user });
      }
    });
  });
  //Actualiza
  routeId.put((req, res) => {
    db.update({ _id: req.params.id }, req.body, err => {
      if (err) {
        console.log(err);
        app.utils.error.send(err, req, res);
      } else {
        res.status(200).json(Object.assign(req.params, req.body));
      }
    });
  });

  //apaga
  routeId.delete((req, res) => {
    db.remove({ _id: req.params.id }, err => {
      if (err) {
        console.log(err);
        app.utils.error.send(err, req, res);
      } else {
        res.status(200).json(req.params.id);
      }
    });
  });
};
