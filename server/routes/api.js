const express = require('express');
const router = new express.Router();
const URL = require('url');
const fs = require('fs');
const db = require('../models');
const Coin = db.coin
const request = require('request');
const config = require('../config/index.json')

var CoinMarketCap = require("node-coinmarketcap");
var coinmarketcap = new CoinMarketCap();

const username = config.username;
const password = config.password;
const binance = require('node-binance-api');
binance.options({
	'APIKEY':'ugjJGDi7AOs2mYJLi3FJd0s86AY2DQGSDSPY3FDfbg8t8UPwcqoBhQIxiqKJ2uSl',
	'APISECRET':'Wwhm2MwTBWIILx2bxy5PPvuOaTqWqlOqwTEoyNlEYBmoS9CjywGsG9vFAZXYnEAN'
});



// get coin to view
router.get('/coin/:name', (req,res,next)=> {
  const name  = req.params.name.substring(0,1).toLocaleUpperCase() + req.params.name.substring(1);
  Coin.findOne({ where: {coinname: name}}).then(coin => {
    if(!coin){res.status(400).end()}
    res.status(200).send(coin)
  })
})


function getPrices(){
	coinmarketcap.multi(coins => {
  	console.log(coins.getTop(10)); // Prints information about top 10 cryptocurrencies
	});
}


// get all coin list
router.get('/coins', (req,res,next)=>{
	Coin.findAll({attributes:['coinname','ticker']}).then(coin=>{
		if(!coin){res.status(400).end()}
		res.status(200).send(coin)
	})
})




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
