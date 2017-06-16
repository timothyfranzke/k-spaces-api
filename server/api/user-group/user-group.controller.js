let mongo = require('mongodb');


export function list(req,res){
    var entity_id = req.user.application_data.entity_id;
    console.log(entity_id);

    let db = require('../../services/db/db.service').getDb();

    db.collection('userGroup').findOne({"active":true, "entity_id":entity_id}, function(err, result){
        if (err) return console.log(err);

        let userGroupResult = {
            "data" : result
        };
        res.json(userGroupResult);
    })
};

export function get(req,res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    var entity_id = req.user.application_data.entity_id;

    db.collection('userGroup').find( {"_id" : id, "entity_id":entity_id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../services/db/db.service').getDb();

    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.entity_id = req.user.application_data.entity_id;

    db.collection('userGroup').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        res.json(entityResult)
    })
};


export function update(req, res){
    let db = require('../../services/db/db.service').getDb();
    var entity_id = req.user.application_data.entity_id;
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('userGroup').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    var entity_id = req.user.application_data.entity_id;

    db.collection('userGroup').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
