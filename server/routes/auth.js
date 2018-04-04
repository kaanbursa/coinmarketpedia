const express = require('express');
const validator = require('validator');
const passport = require('passport');
const router = new express.Router();
const config = require('../config/index.json');

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgrid);


/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }


  return passport.authenticate('local-signup', (err, token) => {

    if (err) {
      if (err.name === 'SequelizeError') {

        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            email: 'This email is already taken.'
          }
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    var toEmail = new helper.Email(req.body.email);
    var fromEmail = new helper.Email('no-reply@coinmarketpedia.com');
    var subject = 'Signed Up Succesfuly!';

    var content = new helper.Content('text/plain', 'Thank you for sign ing up with CoinMarketPedia!.\n\n' +
        'Please click on the following link, or paste this into your browser to continue:\n\n' +
        'https://' + req.headers.host + '\n\n' +
        'If this is not you email contact us by replying to this email!.\n');
    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });


    sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
  })

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up!',
      token
    });
  })(req, res, next);
});

const request = require('request');

router.post('/google/signup', (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  request('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token, (err,response,body) => {
    if (err) {
      return res.status(401).json({error: 'An error occured communication with google'})
    } else {

      return passport.authenticate('local-signup', (err, token) => {

        if (err) {
          if (err.name === 'SequelizeError') {

            // the 409 HTTP status code is for conflict error
            return res.status(409).json({
              success: false,
              message: 'Check the form for errors.',
              errors: {
                message: 'This email is already taken.'
              }
            });
          }

          return res.status(400).json({
            success: false,
            message: 'Could not process the form.'
          });
        }
        var toEmail = new helper.Email(req.body.email);
        var fromEmail = new helper.Email('no-reply@coinmarketpedia.com');
        var subject = 'Signed Up Succesfuly!';

        var content = new helper.Content('text/plain', 'Thank you for sign ing up with CoinMarketPedia!.\n\n' +
            'Please click on the following link, or paste this into your browser to continue:\n\n' +
            'https://coinmarketpedia.com' + '\n\n' +
            'If this is not you email contact us by replying to this email!.\n');
        var mail = new helper.Mail(fromEmail, subject, toEmail, content);

        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });


        sg.API(request, function (error, response) {
        if (error) {
          console.log('Error response received');
        }
      })

        return res.status(200).json({
          success: true,
          message: 'You have successfully signed up!',
          token
        });
      })(req, res, next);
    }
  })

})



router.post('/login', (req, res) => {
  console.log(req.body)
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {

    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(401).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res);

});





module.exports = router;
