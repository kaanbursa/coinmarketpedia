const express = require('express');
const router = new express.Router();
const db = require('../models');
const Coin = db.coin;
const Term = db.term;

// edit coin
router.post('/coin/:name', (req,res,next) => {
	const name = req.params.name.toLowerCase();
	const raw = req.body;
	Coin.findOne({where: {coinname: name}}).then(coin => {
		if(!coin){return res.status(401).json({error: 'An error occured with the server' })}
    else {
      coin.update({
        htmlcode:  raw
      }).then(newCoin =>{
        if(!newCoin){return res.status(401).end()}
        if(newCoin){ return res.status(200).json({success: 'You have succesfuly loged in' })}
      })
    }
	})
})


// create new coin
router.post('/newcoin', (req,res,next)=> {

  const dataGrid = req.body;
	Coin.findOne({ where: { coinname: dataGrid.name } })
      .then(coin => {
        if (coin) {
          return res.status(401).json({error: 'Coin already exists' })
        } else {
        return Coin.create(
					{coinname: dataGrid.name.toLowerCase().replace(/\s/g, ''), ticker: dataGrid.ticker}).then(newCoin =>{
	        if(!newCoin){return res.status(401).end()}
	        if(newCoin){ return res.status(200).send(newCoin)}
	      })
			}
    });
})

// create new term
router.post('/newterm', (req,res,next)=> {

  const dataGrid = req.body;
	console.log(dataGrid)
	Term.findOne({ where: { term: dataGrid.term } })
      .then(term => {
        if (term) {
          return res.status(401).json({error: 'Term already exists' })
        } else {
        return Term.create(
					{term: dataGrid.term.toLowerCase().replace(/\s/g, ''), description: dataGrid.description}).then(newTerm =>{
	        if(!newTerm){return res.status(401).end()}
	        if(newTerm){ return res.status(200).send(newTerm)}
	      })
			}
    });
})

router.post('/delete/:coin', (req,res,next) => {
	const coin  = req.params.coin.toLowerCase()
	Coin.findOne({where: {coinname: coin}}).then(coin => {
		if(!coin) {
			return res.status(401).json({error: 'Something went wrong' })
		} else {
			coin.destroy({force: true})
			return res.status(200).json({success: 'Deleted the coin' })
		}
	})
})

router.get('/edit/:coin', (req,res,next) => {
	let coin = req.params.coin.toLowerCase()
	Coin.findOne({where: {coinname: coin}}).then(coin => {
		if(!coin) {
			return res.status(144).json({error: 'Something went wrong' })
		} else {
			return res.status(200).send(coin)
		}
	})
})

router.post('/edit/:coin', (req,res,next) => {
	let coin = req.params.coin.toLowerCase()
	let dataGrid = req.body
	Coin.findOne({where: {coinname: coin}}).then(coin => {
		if(!coin) {
			return res.status(401).json({error: 'Something went wrong' })
		} else {
			coin.update({
				name: dataGrid.name,
				coinname: dataGrid.coinname.toLowerCase(),
				ticker: dataGrid.ticker,
				image: dataGrid.image,
				videoId: dataGrid.videoId,
				website: dataGrid.website,
				tweeter: dataGrid.tweeter,
				htmlcode: dataGrid.htmlcode,
				github: dataGrid.github,
				icoPrice: dataGrid.ico,
				homeImage: dataGrid.homeImage,
				category: dataGrid.category,
				paper: dataGrid.paper,
			})
			return res.status(200).send({successMessage: 'Updated'})
		}
	})
})


module.exports = router;
