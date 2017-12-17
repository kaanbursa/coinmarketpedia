const express = require('express');
const router = new express.Router();
const XLSX = require('xlsx');
const URL = require('url');
const fs = require('fs');
const db = require('../models');
const Formula = db.formula
const Table = db.table
const request = require('request');
const config = require('../config/index.json')

const username = config.username;
const password = config.password;

auth = "Basic " + new Buffer(username + ":" + password).toString("base64");


function getApache(url,path,callback){
   var options = {
      url: url,
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    };

    const file = fs.createWriteStream(path)
    file.on('close', err => {
      callback();
    })

    file.on('error', function(err) {
      callback(err);
    });

    return request(options, callback).pipe(file);

}
var workbook = {}
var ws= {}
var sheet = {}
var ss = []

// getApache('http://lme2.hksmetals.eu/lme.xlsx','./dist/excel/lme.xlsx', function (err, data){
//     workbook = XLSX.readFile("./dist/excel/lme.xlsx")
//     var wsname = workbook.SheetNames[2];
//     ws = workbook.Sheets[wsname]
//     sheet = XLSX.utils.sheet_to_json(ws, {header:1});
//     var workbooks = []
//     var wses = []
//     var wsn = workbook.SheetNames
//     // turn each workbook to json file
//     wsn.forEach( (i) => {
//       var wss = workbook.Sheets[i]
//       wses.push(wss)
//       workbooks.push(XLSX.utils.sheet_to_json(wss, {header:1}))
//     })
//     // clear the empty rows from all arrays
//     var ss = []
//     workbooks.forEach( (i) => {
//         ss.push(i.filter( (item) => {
//           return !(item.length === 0)
//         }))
//     })
//     // Clean the sheet
//     sheet = sheet.filter(function(item) {
//         return !(item.length === 0)
//     })
//
// });

// Formula.bulkCreate([{
//   tablename: 'MOTOREN',
//   materialname: 'ELEKTRO MOTOREN (MIX FE EN GEGOTEN ALU)',
//   vk: 20,
//   marge: 255,
//   transport: 20,
//   verwerking: 40,
//   materialId: 4
// },
// {
//   tablename: 'MOTOREN',
//   materialname: 'ELEKTRO MOTOREN MET POMPEN EN V. KASTEN',
//   vk: 25,
//   marge: 150,
//   transport: 10,
//   verwerking: 45,
//   materialId: 4
// },{
//   tablename: 'ALUMINIUM SOORTEN',
//   materialname: 'SGD HAMMEL: ALU GESLAGEN BASIS 2%',
//   vk: 20,
//   marge: 255,
//   transport: 20,
//   verwerking: 40,
//   materialId: 4
// },{
//   tablename: 'ALUMINIUM SOORTEN',
//   materialname: 'HKS SCHAAR: ALU GESLAGEN BASIS 2%',
//   vk: 20,
//   marge: 255,
//   transport: 20,
//   verwerking: 40,
//   materialId: 4
// },{
//   tablename: 'ALUMINIUM SOORTEN',
//   materialname: 'ALUMINIUM GEGOTEN BASIS 5%',
//   vk: 20,
//   marge: 255,
//   transport: 20,
//   verwerking: 40,
//   materialId: 4
// },{
//   tablename: 'ALUMINIUM SOORTEN',
//   materialname: 'ALUMINIUM VELGEN GEMENGD',
//   vk: 20,
//   marge: 255,
//   transport: 20,
//   verwerking: 40,
//   materialId: 4
// },])

    workbook = XLSX.readFile("./dist/excel/lme.xlsx")
    var wsname = workbook.SheetNames[2];
    ws = workbook.Sheets[wsname]
    sheet = XLSX.utils.sheet_to_json(ws, {header:1});
    var workbooks = []
    var wses = []
    var wsn = workbook.SheetNames
    // turn each workbook to json file
    wsn.forEach( (i) => {
      var wss = workbook.Sheets[i]
      wses.push(wss)
      workbooks.push(XLSX.utils.sheet_to_json(wss, {header:1}))
    })
    // clear the empty rows from all arrays
    var ss = []
    workbooks.forEach( (i) => {
        ss.push(i.filter( (item) => {
          return !(item.length === 0)
        }))
    })
    // Clean the sheet
    sheet = sheet.filter(function(item) {
        return !(item.length === 0)
    })


// Convert to json file and get headers of the column
Formula.belongsTo(Table, {as:'material'});
Table.hasMany(Formula, { foreignKey: 'materialId' });

router.get('/dashboard', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

router.get('/lme',function(req,res,next) {
    if(sheet === {}) {res.status(400).end()}
    else {
      res.status(200).send(sheet)
    }
});

router.get('/dashboard/table', function(req, res, next) {
  getApache('http://lme2.hksmetals.eu/lme.xlsx','./dist/excel/lme.xlsx', function (err, data){
      workbook = XLSX.readFile("./dist/excel/lme.xlsx")
      var wsname = workbook.SheetNames[2];
      ws = workbook.Sheets[wsname]
      sheet = XLSX.utils.sheet_to_json(ws, {header:1});
      var workbooks = []
      var wses = []
      var wsn = workbook.SheetNames
      // turn each workbook to json file
      wsn.forEach( (i) => {
        var wss = workbook.Sheets[i]
        wses.push(wss)
        workbooks.push(XLSX.utils.sheet_to_json(wss, {header:1}))
      })
      // clear the empty rows from all arrays
      var ss = []
      workbooks.forEach( (i) => {
          ss.push(i.filter( (item) => {
            return !(item.length === 0)
          }))
      })
      // Clean the sheet
      sheet = sheet.filter(function(item) {
          return !(item.length === 0)
      })

  });
  Formula.findAll({attributes: ['id','formula','tablename','afslag','materialname']}).then(formula => {
    if(!formula) {res.status(400).end()}
    res.status(200).send([sheet,ws,[formula]])
  })
});

router.get('/dashboard/formula/:id', (req,res,next) => {
  const id = req.params.id;
    res.status(200).send(table)
})


module.exports = router;
