const express = require('express');
const router = new express.Router();
const db = require('../models');
const Coin = db.coin
const User = db.user
const request = require('request');
const config = require('../config/index.json');
const jwt = require('jsonwebtoken');
const async = require('async');
const randomBytes = require('random-bytes');
const validator = require('validator');
const bCrypt = require('bcrypt-nodejs');
const adminRoutes = require('./../routes/admin');


var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgrid);

Coin.belongsTo(User)


function validatesEmail(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

// get coin to view
router.get('/coin/:name', (req,res,next)=> {
  // .substring(0,1).toLocaleUpperCase() + req.params.name.substring(1)

  let name  = req.params.name.toLowerCase();


  Coin.findOne({ where: {coinname: name}}).then(coin => {
    if(!coin){ return res.status(400).send()}
    else {
      if(coin.coinname === 'bitcoincash'){
        name = 'Bitcoin Cash'
      }
    				res.status(200).send(coin)


    }

  })

});



// get all coin list
router.get('/coins', (req,res,next)=>{
	Coin.findAll({attributes:['coinname','ticker','image']}).then(coin=>{

		if(!coin){res.status(400).end()}

		res.status(200).send(coin)
	})
});

// user submision coin
router.post('/register', (req,res,next)=>{
  console.log(req.body)
  const dataGrid = req.body
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }
    const userId = decoded.sub;

    return User.findById(userId).then(function(user) {
      if (!user) {
        return res.status(401).end();
      } else {
        user.update(
          {submission: dataGrid}).then(submission =>{
          if(!submission){return res.status(401).end()}
          if(submission){ return res.status(200).send(submission)}
        })


        var toEmail = new helper.Email(dataGrid.email);
        var fromEmail = new helper.Email('no-reply@coinmarketpedia.com');
        var subject = 'Thank you for registering';
        var content = new helper.Content('text/plain', dataGrid.username  + ' thank you for registering your coin we will be in touch!'+ '\n\n' +
        datagrid + 'Your informations'
      );
        var mail = new helper.Mail(fromEmail, subject, toEmail, content);

        var request = sg.emptyRequest({
          method: 'POST',
          path: '/v3/mail/send',
          body: mail.toJSON()
        });

        sg.API(request, function (error, response) {
        if (error) {
          console.log('Error response received');
          consoel.log(error)
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
      });
      }
    })

  });
});




router.post('/forgot', (req,res,next) => {

  const validationResult = validatesEmail(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  const email = req.body.email;
  async.waterfall([
    (done)  => {
      randomBytes(12, function (err, bytes) {
        var token = bytes.toString('hex')
        done(err,token)
      })
    },
    (token, done) => {
      User.findOne({where:{email:email}}).then(user => {
        if(!user){return res.status(401).end({errors:'No user found with that email adress'})}

        const date= Date.now() + 3600000;
        const passToken = token
        user.update({resetPasswordToken: passToken, resetPasswordExpires: date}).then(user => {
          done(null, passToken, user)
        })

      })
    },
    (passToken,user,done) => {
      var toEmail = new helper.Email(user.email);
      var fromEmail = new helper.Email('no-reply@coinmarketpedia.com');
      var subject = 'Reset Your Password';
      var content = new helper.Content('text/plain', 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + passToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n');
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

    });
    res.status(200).json({success:'You will recieve and email shortly!'})
    done(null, user)
  }

 ],
 (err) => {
   if(err){return done(err)}
   else {return done(null)}
 });
});

router.get('/reset/:token', (req,res) => {
  if(typeof(req.params.token) === 'string' || typeof(req.params.token) === 'buffer'){
    User.findOne({where:{resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}}).then(user => {
      if(!user){return res.status(401).send({errors:'The token has expired'})}
      res.status(200).send({success:'You can change you password now!'})
    })
  } else {
    return res.status(401).end({errors:'Wrong Token'})
  }

})

router.post('/reset/:token', (req,res) => {
  async.waterfall([
    (done) => {
      User.findOne({where:{resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() }}}).then(user => {
        if(!user){return res.status(401).send({errors:'The token has expires'})}
        const password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(8), null);;

        user.update({password:password, resetPasswordToken: null, resetPasswordExpires: null}).then(user => {
          done(undefined,user)
        }).catch(err => {
          done(err,user)
        })
      })
    },
    (user, done) => {
      var toEmail = new helper.Email(user.email);
      var fromEmail = new helper.Email('no-reply@coinmarketpedia.com');
      var subject = 'Succesfuly Changed Password!';
      var content = new helper.Content('text/plain', 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n');
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

      res.status(200).json({success:'You have succesfuly changed the password!'})
      done(null,user)
    });
    }
  ],(err) => {
    if(err){return done(err)}
    else {return done(null)}

  })
})


router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});


router.get('/dashboard/table', function(req, res, next) {

});



module.exports = router;
