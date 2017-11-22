var express = require('express');
var bodyparser = require('body-parser');

var fs = require('fs');
var passport = require("passport");
var passportJWT = require("passport-jwt");
let passwordGenerator = require("./server/utilities/password-generator");
var nodemailer = require('nodemailer');
let auth = require('./server/services/auth/auth.service');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var morgan      = require('morgan');
var mongoose    = require('mongoose');
let config      = require('./server/config/configuration');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

//var im = require('imagemagick');
//var sharp = require('sharp');

var app = express();
var _db = require('./server/services/db/db.service');


var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'tasmanianDevil';

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

app.use(bodyparser.json({limit: '50mb'}));
app.use("/", express.static(__dirname + '/public'));
app.use("/login", express.static(__dirname + '/public/login'));
app.use("/api/search", require('./server/api/search'));
app.use("/api/user", require('./server/api/user-detail'));
app.use("/api/entity", require('./server/api/entity'));
app.use("/api/user-group", require('./server/api/user-group'));
app.use("/api/event", require('./server/api/event'));
app.use("/api/spaces", require('./server/api/space'));
app.use("/api/location", require('./server/api/location'));
app.use("/api/message", require('./server/api/message'));
app.use("/api/profile", require('./server/api/profile'));
app.use("/api/payment", require('./server/api/payment'));
app.use("/api/financial/pay-period", require('./server/api/financial/payment_period'));
app.use("/api/financial/tuition_rate", require('./server/api/financial/tuition_rate'));
app.use("/api/activity", require('./server/api/activity'));
app.use("/api/note", require('./server/api/notes'));

app.use("/api/vendor/user", require('./server/api/vendor/user-detail'));
app.use("/api/vendor/event", require('./server/api/vendor/event'));
app.use("/api/vendor/spaces", require('./server/api/vendor/spaces'));
app.use("/api/vendor/profile", require('./server/api/vendor/profile'));
app.use("/api/vendor/entities", require('./server/api/vendor/entities'));

app.use("/command-center", express.static(__dirname + '/public/command-center'));
app.use("/auth", express.static(__dirname + "/public/auth"));

//app.use("/api/message", require('./server/api/message'));

mongoose.connect(config.database, function(err){

});
_db.connectToServer(function(){
    app.listen(process.env.PORT || 3008, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });
});

app.get('/api/generate-password', function(req, res){
   console.log(passwordGenerator.generatePassword());
   let response = {
     "pw":passwordGenerator.generatePassword()
   };
   res.send(response);
});

app.post('/api/login', function(req, res){
    console.log(req);
    res.send("123456");
});

var getEntityId = function(){
    return '58dbe71a278b2216b1c1abe4';
};

//db actions


