let mongo = require('mongodb');


export function list(req,res){
    var entity_id = req.params.entity_id;
    console.log(entity_id);

    let db = require('../../services/db/db.service').getDb();
    db.collection('userDetail').find({"active":true, "entity_id":entity_id}).toArray(function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function get(req,res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    var entity_id = req.params.entity_id;

    db.collection('userDetail').find( {"_id" : id, "entity_id":entity_id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../services/db/db.service').getDb();
    let emailer = require('../../services/message/message.service');

    req.body.active = true;
    req.body.date_created = Date.now();
    var entity_id = req.params.entity_id;

    db.collection('userDetail').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        let message = {
            to: req.body.email,
            subject: "K-Spaces Account Created",
            body:"<p>An account has been created for you using this email</p><p>Please log in at k-spaces.herokuapp.com and enter the temporary password <b>"+ req.body.temp_password +"</b></p>"
        };

        emailer.sendEmail(message, res.json(entityResult));
    })
};


export function update(req, res){
    let db = require('../../services/db/db.service').getDb();
    var entity_id = req.params.entity_id;
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    var entity_id = req.params.entity_id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
