const express = require('express');
const router = new express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const Coin = db.coin;
const User = db.user;

User.hasOne(Coin, {foreignKey: 'userId'})
Coin.belongsTo(User, {foreignKey: 'coinId'})

router.get('/profile', (req,res,next) => {
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

    return User.find({where:{id:userId},
      include:[{model: Coin}]})
      .then(function(user) {
      if (!user) {
        return res.status(400).end();
      } else {
        var myuser = [user.email,user.submission,user.coin]
        return res.status(200).send(myuser);
      }
    })

  });
})

router.post('/edit/post', (req,res,next) => {

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
        return res.status(400).end();
      } else {
        user.update({submission:dataGrid}).then(submission => {
          if (!submission){
            return res.status(400).json({errors: 'An error occured during '})
          } else {
            return res.status(200).json({success:'You have successfuly updated your details'})
          }

        })
      }
    })

  });
})


router.post('/suggestion/:coin', (req,res,next) => {
  const coin = req.params.coin
  const dataGrid = req.body
  var obj = {coin: coin, from: dataGrid.from, to:dataGrid.to}
  obj = JSON.stringify(obj)
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
        return res.status(400).end();
      } else {
        user.update({
          suggestion: user.sequelize.fn('array_append', user.sequelize.col('suggestion'), obj)
        }).then(suggestion => {
          if (!suggestion){
            return res.status(400).json({errors: 'An error occured during '})
          } else {
            return res.status(200).json({success:'Thank you for suggesting a change!'})
          }

        })
      }
    })

  });
})

module.exports = router;
