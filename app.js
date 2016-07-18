var express = require ('express');
var mongoose = require('mongoose');
var Receipt = require('./models/Receipt');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

var db = mongoose.connect('mongodb://app_wots:app_wots@ds017258.mlab.com:17258/wots')
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


var receiptRouter = require('./routes/ReceiptRoutes')(Receipt);
app.use('/api/receipts', receiptRouter)

app.get('/', function (req,res) {
    res.send('Word On The Street API')
});

app.listen(port, () => {
    console.log('Running server on PORT: '+    port)
});
