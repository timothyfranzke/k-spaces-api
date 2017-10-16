let mongo = require('mongodb');

export function list(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let entity_id = req.user.application_data.vendor_id;

    db.collection('spaces').find({"active":true, "vendor_id" : vendor_id}).toArray(function(err, result){
        if (err) return console.log(err);

        let spaceResult = {
          data : result
        };

        res.json(spaceResult);
    })
};

export function get(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('spaces').find( {"_id" : id, "vendor_id":vendor_id}).toArray(function(err,result){
        if (err) return console.log(err);

      let spaceResult = {
        data : result
      };

        res.json(spaceResult);
    })
};

export function create(req,res){
    let db = require('../../../services/db/db.service').getDb();
    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.vendor_id = req.user.application_data.vendor_id;

    db.collection('spaces').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        let location_id = mongo.ObjectID(req.body.location._id);
        let space = {
            "name" : req.body.name,
            "_id": entityResult._id
        };
        db.collection('location').findOneAndUpdate({"_id":location_id}, {$push:{"spaces": space}});
        res.json(entityResult);
    })
};

export function update(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    delete req.body._id;
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('spaces').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('spaces').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

