let mongo = require('mongodb');

//event
export function list(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('event').find({"active":true, "vendor_id":vendor_id}).toArray(function(err, result){
        if (err) return console.log(err);

        let eventResult = {
            data : result
        };
        res.json(eventResult);
    })
};

export function get(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);

    db.collection('event').find( {"_id" : id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../../services/db/db.service').getDb();
    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.vendor_id = req.user.application_data.vendor_id;
    //req.body.entity_id = req.params.entity_id;

    db.collection('event').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        res.json(entityResult);
    })
};

export function update(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let vendor_id = req.user.application_data.vendor_id;
    delete req.body._id;

    db.collection('event').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let vendor_id = req.user.application_data.vendor_id;
    var id = mongo.ObjectID(req.params.id);

    db.collection('event').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
