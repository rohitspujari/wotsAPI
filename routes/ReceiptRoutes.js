var express = require('express')
var Receipt = require('../models/Receipt');
var Firebase = require('firebase');

//var myFirebaseRef = new Firebase('https://wots.firebaseio.com/');

Firebase.initializeApp({
  databaseURL: "https://wots.firebaseio.com/"
});
db = Firebase.database()
var ref = db.ref("receipts/");

var ReceiptRoutes = function(Receipt){

  var receiptRouter = express.Router();

  receiptRouter.route('/')
    .get(function(req,res) {
      var query = {}
      if(req.query) {
        if(req.query.genre)
          query.genre = req.query.genre
      }
      ref.once('value', (snap)=>{
        res.json(snap.val())
      })

    })
    .post(function(req,res){

      if(req.body.cc){
        let paymentRef = db.ref("payment/");
        paymentRef.child(req.body.cc).once('value',function(snaphot){
          let cc = snaphot.val();
          if(cc){
            ref.child(cc.uid).push(req.body, function(err){
              if(err){
                console.log('Error writing!');
              }
              else {
                res.status(201).send(req.body)
              }
            })
          }
          else{
            res.status(504).send('user doesn not exist for this card')
          }
        })

      }





      // ref.child('629f31df-d6fc-4c32-ae6d-9787fe6a654f').push(req.body, function(err){
      //   if(err){
      //     console.log('Error writing!');
      //   }
      //   else {
      //     res.status(201).send(req.body)
      //   }
      // })



      // var receipt = new Receipt(req.body);
      // receipt.save()
      // res.status(201).send(receipt)
    });

  receiptRouter.use('/:receiptId', function(req,res,next){
    Receipt.findById(req.params.receiptId, function(err, receipt){
      if(err)
        res.status(500).send(err)
      else if(receipt){
        req.receipt = receipt;
        next();
      }
      else{
        res.status(404).send('No Receipt Found')
      }
    })
  })

  receiptRouter.route('/:receiptId')
    .get(function(req,res){
      res.json(req.receipt)
    })
    .put(function(req,res){
      req.receipt.author = req.body.author;
      req.receipt.title = req.body.title;
      req.receipt.genre = req.body.genre;
      req.receipt.read = req.body.read;
      req.receipt.save()
      res.json(req.receipt)
    })
    .patch(function(req, res){
      if(req.body._id)
        delete req.body._id
      for(p in req.body){
        req.receipt[p] = req.body[p]
      }
      req.receipt.save(function(err){
        if(err)
          res.status(500).send(err)
        else {
          res.json(req.receipt)
        }
      })
    })
    .delete(function(req, res){
      req.receipt.remove(function(err){
        if(err)
          res.status(500).send(err)
        else {
          res.status(204).send('Removed')
        }
      })
    })

      return receiptRouter;



}

module.exports = ReceiptRoutes;
