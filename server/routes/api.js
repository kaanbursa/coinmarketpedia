const express = require('express');
const router = new express.Router();
const URL = require('url');
const fs = require('fs');
const db = require('../models');
const Coin = db.coin
const User = db.user
const request = require('request');
const config = require('../config/index.json')

var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(config.sendgrid);


// get coin to view
router.get('/coin/:name', (req,res,next)=> {
  // .substring(0,1).toLocaleUpperCase() + req.params.name.substring(1)
  const name  = req.params.name;
		coinmarketcap.get(name, cmc => {
			if(cmc){
				Coin.findOne({ where: {coinname: name}}).then(coin => {
					if(!coin){res.status(400).end()}
					res.status(200).send([coin,cmc])
				})
			}
	})

});



// get all coin list
router.get('/coins', (req,res,next)=>{
	Coin.findAll({attributes:['coinname','ticker']}).then(coin=>{

		if(!coin){res.status(400).end()}

		res.status(200).send(coin)
	})
});

// user submision coin
router.post('/register', (req,res,next)=>{
	console.log(req.body)
  const dataGrid = req.body
  User.create(
    {submission: dataGrid, password: 'pass', username:dataGrid.username, email:dataGrid.email}).then(submission =>{
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
