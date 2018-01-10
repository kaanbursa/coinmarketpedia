const express = require('express');
const router = new express.Router();
const URL = require('url');
const fs = require('fs');
const db = require('../models');
const Coin = db.coin
const request = require('request');
const config = require('../config/index.json')


router.get('/coin/:name', (req,res,next)=> {
  const name  = req.params.name
  console.log(name)
  Coins.findOne({ where: {coinname: name}}).then(coin => {
    if(!formula){res.status(400).end()}
    res.status(200).send(coin)
  })
})
