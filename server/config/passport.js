//load bcrypt
const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt-nodejs');
const config = require('./index');

module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    passport.use('local-signup', new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            var generateHash = function(password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            console.log(password)
            console.log(email)
            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                    err = {
                      name: 'SequelizeError'
                    }
                    return done(err, false, {
                        message: 'That email is already taken'
                    });
                } else {
                    var userPassword = generateHash(password);

                    var data =
                        {
                            email: email,
                            password: userPassword,
                            username: req.body.name.trim(),
                        };
                    User.create(data).then(function(newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            const payload = {
                              sub: newUser.id
                            };
                            const token = jwt.sign(payload, config.jwtSecret);
                            return done(null, token, newUser);
                        }
                    });
                }
            });
        }
    ));

    passport.use('local-login', new LocalStrategy(

    {
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        var User = user;
        var isValidPassword = function(userpass, password) {
            return bCrypt.compareSync(password, userpass);
        }

        User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: 'Email does not exist'
                });
            }
            if (!isValidPassword(user.password, password)) {
                err = {
                  name: 'IncorrectCredentialsError',
                  message: 'Incorrect Credentials.'
                }
                return done(err, false, {
                    message: 'Incorrect Credentials.'
                });
            }
            const payload = {
              sub: user.id
            };
            // create a token string
            const token = jwt.sign(payload, config.jwtSecret);
            const userinfo = user.get();
            return done(null, token,  userinfo);

        })
    }

));
}
