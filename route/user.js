var jwt        = require("jsonwebtoken");
var log         = require('../lib/log');
var User = require('save')('user', require('../config/saveConfig'));
var tokenConfig = require('../config/tokenConfig');

var user = {
  authenticate: function(req, res, next) {
    User.findOne(
      {email: req.params.email, password: req.params.password},
      function(err, user) {
        if (err) {
            res.send({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
               res.send({
                    type: true,
                    data: user,
                    token: user.token
                });
            } else {
                res.send({
                    type: false,
                    data: "Incorrect email/password"
                });
            }
        }
    });
  },
  signUp: function(req, res, next) {
    User.findOne(
      {email: req.params.email, password: req.params.password},
      function(err, user) {
        if (err) {
          log.error(err);
            res.send({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.send({
                    type: false,
                    data: "User already exists!"
                });
            } else {
              User.create(
                { email: req.params.email, password: req.params.password },
                function(error, user) {
                  user.token = jwt.sign(user, tokenConfig.jwt_secret, {expiresInMinutes: 30});
                  User.update(user, function(error, userObj) {
                    if(error) log.error(error);
                    res.send({
                      type: true,
                      data: userObj,
                      token: userObj.token
                    });
                  });
              });
            }
        }
    });
  },
  me: function(req, res, next) {
    console.log(req.user);
    User.findOne({token: req.token}, function(err, user) {
         if (err) {
             res.send({
                 type: false,
                 data: "Error occured: " + err
             });
         } else {
             res.send({
                 type: true,
                 data: user
             });
         }
     });
  }
};

module.exports = user;
