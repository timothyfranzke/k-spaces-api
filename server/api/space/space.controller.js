let mongo = require('mongodb');

export function list(req,res){
    let db = require('../../services/db/db.service').getDb();
    var entity_id = mongo.ObjectID(getEntityId());

    db.collection('spaces').find({"active":true}).toArray(function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function get(req,res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);

    db.collection('spaces').find( {"_id" : id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../services/db/db.service').getDb();
    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.entity_id = getEntityId();

    db.collection('spaces').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        var location_id = mongo.ObjectID(req.body.location._id);
        var space = {
            "name" : req.body.name,
            "_id": entityResult._id
        };
        db.collection('location').findOneAndUpdate({"_id":location_id}, {$push:{"spaces": space}})
        res.json(entityResult);
    })
};

export function update(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('spaces').findOneAndUpdate({"_id":id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);

    db.collection('spaces').findOneAndUpdate({"_id":id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

