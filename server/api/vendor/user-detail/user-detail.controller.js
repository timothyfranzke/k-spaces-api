let mongo = require('mongodb');


export function list(req,res){
  let vendor_id = req.user.application_data.vendor_id;
    console.log(vendor_id);

    let db = require('../../../services/db/db.service').getDb();
    db.collection('userDetail').find({"active":true, "vendor_id":vendor_id}).toArray(function(err, result){
        if (err) return console.log(err);

        let userDetailResult = {
            "data" : result
        };
        res.json(userDetailResult);
    })
};

export function get(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('userDetail').find( {"_id" : id, "vendor_id":vendor_id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let emailer = require('../../../services/message/message.service');

    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.vendor_id = req.user.application_data.vendor_id;

    db.collection('userDetail').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        if(!!req.body.email)
        {
          let message = {
            to: req.body.email,
            subject: "K-Spaces Account Created",
            body:"<p>An account has been created for you using this email</p><p>Please log in at k-spaces.herokuapp.com and enter the temporary password <b>"+ req.body.temp_password +"</b></p>"
          };

          emailer.sendEmail(message, function(err, mailResponse){
            res.json(entityResult)
          });
        }
        else{
          res.json(entityResult);
        }
    })
};


export function update(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let vendor_id = req.user.application_data.vendor_id;
    let id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
