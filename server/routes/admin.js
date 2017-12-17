const express = require('express');
const router = new express.Router();
const db = require('../models');
const Formula = db.formula;
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

router.get('/formula', (req,res,next)=> {
  Formula.findAll().then(formula => {
    if(!formula){res.status(400).end()}
    res.status(200).send(formula)
  })
})

router.post('/formula/:id', (req,res,next)=> {
  id = req.params.id;
  const dataGrid = req.body;
  Formula.findById(id).then(formula =>{
    if(!formula){return res.status(401).json({error: 'An error occured with the server' })}
    else {
      formula.update({
        vk: dataGrid.vk,
        formula: dataGrid.formula,
        transport: dataGrid.transport,
        marge: dataGrid.marge,
        verwerking: dataGrid.verwerking,
        afslag: dataGrid.afslag
      }).then(newFormula =>{
        if(!newFormula){return res.status(401).end()}
        if(newFormula){ return res.status(200).send(newFormula)}
      })
    }
  })
})


module.exports = router;
