const express = require('express');
const router = new express.Router();
const db = require('../models');
const Coin = db.coin;
const Table = db.table;

// const initialData = Formula.build({
//     materialname: 'AL',
//     'marge': 203
//   },
//   {
//   materialname: 'ZN',
//   'marge': 201
//     },
//   {
//   materialname: 'SN',
//   'marge': 202
//   },
//   {
//   materialname: 'NI',
//   'marge': 202
//   },
//   {
//   materialname: 'PB',
//   'marge': 203
// },
// {
// materialname: 'CU',
// 'marge': 34
// })
// initialData.save()

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



router.post('/newcoin', (req,res,next)=> {
  const dataGrid = req.body;
	console.log(dataGrid)
	Coin.findOne({ where: { coinname: dataGrid.name } })
      .then(coin => {
        if (coin) {
          return res.status(401).json({error: 'Coin already exists' })
        } else {
        return Coin.create(
					{coinname: dataGrid.name, ticker: dataGrid.ticker}).then(newCoin =>{
	        if(!newCoin){return res.status(401).end()}
	        if(newCoin){ return res.status(200).send(newCoin)}
	      })
			}
    });
})


module.exports = router;
