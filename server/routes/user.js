const express = require('express');
const router = new express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const Coin = db.coin;
const User = db.user;


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

    return User.findById(userId).then(function(user) {
      if (!user) {
        return res.status(400).end();
      } else {
        var myuser = [user.email,user.submission]
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


module.exports = router;
