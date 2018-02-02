const express = require('express');
const router = new express.Router();
const URL = require('url');
const fs = require('fs');
const db = require('../models');
const Coin = db.coin
const User = db.user
const request = require('request');
const config = require('../config/index.json');
const jwt = require('jsonwebtoken');

var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgrid);

Coin.belongsTo(User)

// get coin to view
router.get('/coin/:name', (req,res,next)=> {
  // .substring(0,1).toLocaleUpperCase() + req.params.name.substring(1)
  const name  = req.params.name.toLowerCase();


  Coin.findOne({ where: {coinname: name}}).then(coin => {
    if(!coin){ return res.status(400).end()}
    else {
      coinmarketcap.get(name, cmc => {
          console.log(cmc)
    			if(cmc){
    				res.status(200).send([coin,cmc])
    			}
    	})
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
        User.update(
          {submission: dataGrid, password: 'pass',  email:user.email}).then(submission =>{
          if(!submission){return res.status(401).end()}
          if(submission){ return res.status(200).send(submission)}
        })

        var fromEmail = new helper.Email('kaanbursa9@gmail.com');
        var toEmail = new helper.Email(dataGrid.email);
        var subject = 'Thank you for registering';
        var content = new helper.Content('text/plain', dataGrid.username  + ' thank you for registering your coin we will be in touch!');
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
      }
    })

  });
});




router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});


router.get('/dashboard/table', function(req, res, next) {
	coinmarketcap.multi(coins => {
  	res.send(coins.getTop(10)); // Prints information about top 10 cryptocurrencies
	});
});



module.exports = router;
