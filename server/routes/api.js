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

router.post('/coin/:name', (req,res,next) => {
	const name = req.params.name;
	const raw = req.body;
	console.log(raw)
	Coin.findOne({where: {coinname: name}}).then(coin => {
		if(!coin){return res.status(401).json({error: 'An error occured with the server' })}
    else {
      coin.update({
        htmlcode:  raw
      }).then(newCoin =>{
        if(!newCoin){return res.status(401).end()}
        if(newCoin){ return res.status(200).send(newCoin)}
      })
    }
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

router.get('/dashboard/formula/:id', (req,res,next) => {
  const id = req.params.id;
    res.status(200).send(table)
})


module.exports = router;
