const express = require('express');
const router = new express.Router();
const URL = require('url');
const fs = require('fs');
const db = require('../models');
const Coin = db.coin
const Table = db.table
const request = require('request');
const config = require('../config/index.json')

const username = config.username;
const password = config.password;
const binance = require('node-binance-api');
binance.options({
	'APIKEY':'ugjJGDi7AOs2mYJLi3FJd0s86AY2DQGSDSPY3FDfbg8t8UPwcqoBhQIxiqKJ2uSl',
	'APISECRET':'Wwhm2MwTBWIILx2bxy5PPvuOaTqWqlOqwTEoyNlEYBmoS9CjywGsG9vFAZXYnEAN'
});

router.get('/coin/:name', (req,res,next)=> {
  const name  = req.params.name
  Coin.findOne({ where: {coinname: name}}).then(coin => {
    if(!coin){res.status(400).end()}
    res.status(200).send(coin)
  })
})

router.get('/coins', (req,res,next)=>{
	Coin.findAll({attributes:['coinname']}).then(coin=>{
		if(!coin){res.status(400).end()}
		res.status(200).send(coin)
	})
})



// Convert to json file and get headers of the column

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});


router.get('/dashboard/table', function(req, res, next) {
  binance.prices(function(ticker) {
  	res.send(ticker)
  });
});



module.exports = router;
