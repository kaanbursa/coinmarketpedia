const express = require('express');
const router = new express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/index');
const Coin = db.coin;
const User = db.user;
const Reply = db.reply;
const Comment = db.comment;
const Like = db.like;
const Validation = db.validation;
const Contribution = db.contribution;

User.hasOne(Coin, {foreignKey: 'userId'})
User.hasMany(Contribution, {foreignKey: 'userId'})
Coin.belongsTo(User, {foreignKey: 'coinId'})


// comment user reply like assocation

User.hasMany(Comment, {foreignKey: 'userId'});
Comment.belongsTo(User, {foreignKey: 'userId'});
Reply.belongsTo(Comment);
Like.belongsTo(Comment);
User.hasMany(Like, {foreignKey: 'userId'});


function getId (token) {

  // get the last part from a authorization header string like "bearer token-value"
  const idToken = token
  // decode the token using a secret key-phrase
  return jwt.verify(idToken, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return null }
    const userId = decoded.sub;
    return userId
  });
}





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

    return User.findOne({where:{id:userId},
      attributes:['id','username','email','submission','suggestion','about','rank'],
      include:[{model: Contribution, limit:5},
        {model: Comment, include:[{model:Coin, attributes:['coinname']}]}
      ]})
      .then(function(user) {
      if (!user) {
        return res.status(400).end();
      } else {
        var myuser = [user,user.submission,user.coin]
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


router.post('/edit/user', (req,res,next) => {
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
        user.update(dataGrid).then(newuser => {
          if (!newuser){
            return res.status(400).json({errors: 'An error occured during '})
          } else {
            return res.status(200).json({success:'You have successfuly updated your details'})
          }

        })
      }
    })

  });
})

router.post('/delete/:id', (req,res,next) => {
  const id = req.params.id
  const userId= req.body.userId
  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  Contribution.destroy({where:{id:id, userId:userId}}).then(function(cont) {
    if (!cont) {
      return res.status(400).end();
    } else {
      return res.status(200).json({success:'You have successfuly deleted your contribution!'})
    }
  })
})


router.post('/upvote' , (req,res,next) => {
  const dataGrid = req.body;
  console.log(req.body)
  Validation.create({
    userId: parseInt(dataGrid.userId),
    contributionId: parseInt(dataGrid.contributionId)
  }).then(result => {
    if(!result){
      return res.status(400).json({error: 'Unable to finish your request'});
    }

    return res.status(200).send();
  })

})

router.post('/downvote' , (req,res,next) => {
  const dataGrid = req.body;
  console.log(req.body)
  Validation.destroy({where:{userId:parseInt(dataGrid.userId),contributionId:parseInt(dataGrid.contributionId)}
  }).then(result => {
    if(!result){
      return res.status(400).json({error: 'Unable to finish your request'});
    }

    return res.status(200).send();
  })

})


router.post('/contribution/:coin', (req,res,next) => {
  const coin = req.params.coin.toLowerCase();
  const dataGrid = req.body;
  Object.keys(dataGrid).map(key => {
    if(dataGrid[key] === ''){
      delete dataGrid[key]
    }
    return dataGrid
  })

  if (!req.headers.authorization) {
    return res.status(401).end();
  }
  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];
  var contribution = ''
  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).json({errors: 'You need to login again'}); }
    const userId = decoded.sub;

    Contribution.findAndCountAll({where:{userId:userId}}).then(result => {
      if(result.count === 0){
        contribution = 'You have made your first contribution!'
      }
    });

    return User.findById(userId).then(function(user) {
      if (!user) {
        return res.status(400).end();
      } else {
        Contribution.create({
          userId: userId,
          coinId: parseInt(dataGrid.id),
          text: dataGrid,
          coinname: coin
        }).then(suggestion => {
          if (!suggestion){
            return res.status(400).json({errors: 'An error occured during '})
          } else {
            if(contribution === ''){
              return res.status(200).json({success:'Thank you for suggesting a change!'})
            } else {
              return res.status(200).json({success:'Thank you for suggesting a change!',first:contribution})
            }

          }

        }).catch(err => {
          if(err) {
            return res.status(400).json({errors: 'An error occured during '})
          }
        })
      }
    })

  });
})

router.post('/suggestion/:coin', (req,res,next) => {
  const coin = req.params.coin
  const dataGrid = req.body
  var obj = {coin: coin, from: dataGrid.newInfo, to:dataGrid.changeTo}
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

router.post('/comment', (req,res,next) => {

  const userId = getId(req.headers.authorization.split(' ')[1])
  if(userId) {
  	const dataGrid = req.body
    console.log(req.body)
    const coinId = parseInt(dataGrid.coinid)
  	Comment.create({
      text: dataGrid.comment,
      title: dataGrid.title,
      userId: userId,
      coinId: coinId,
    }).then(comment => {
  		if(!comment) {
  			return res.status(401).json({error: 'Something went wrong' })
  		} else {
  			return res.status(200).send({successMessage: 'You have succesfully commented'})
  		}
  	}).catch(function(err) {
    // print the error details
      console.log(err);
    });
  } else {
    return res.status(200).json({error:'You need to login'})
  }

})


//reply to post
router.post('/:id/reply', (req,res,next) => {
  const userId = getId(req.headers.authorization.split(' ')[1])
  const commentId = req.params.id
  if(userId) {
  	const dataGrid = req.body
    const coinId = parseInt(dataGrid.coinid)
  	Reply.create({
      text: dataGrid.text,
      userId: userId,
      commentId: commentId,
    }).then(reply => {
  		if(!reply) {
  			return res.status(401).json({error: 'Something went wrong' })
  		} else {
  			return res.status(200).send({successMessage: 'You have succesfully replied'})
  		}
  	}).catch(function(err) {
    // print the error details
      console.log(err);
    });
  } else {
    return res.status(200).json({error:'You need to login'})
  }
})


router.post('/comment/like', (req,res,next) => {
  const dataGrid = req.body;
  Like.create({
    userId: parseInt(dataGrid.userId),
    commentId: parseInt(dataGrid.commentId)
  }).then(result => {
    if(!result){
      return res.status(400).json({error: 'Unable to finish your request'});
    }

    return res.status(200).send();
  })
})

router.post('/comment/dislike', (req,res,next) => {
  const dataGrid = req.body;
  console.log(req.body)
  Like.destroy({where:{userId:parseInt(dataGrid.userId),commentId:parseInt(dataGrid.commentId)}
  }).then(result => {
    if(!result){
      return res.status(400).json({error: 'Unable to finish your request'});
    }

    return res.status(200).send();
  })
})

module.exports = router;
