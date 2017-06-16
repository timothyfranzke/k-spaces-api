let mongo = require('mongodb');

export function get(req,res){
    let db = require('../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.user.id);

    let entity_id = req.user.application_data.entity_id;

    db.collection('userDetail').findOne( {"_id" : id, "entity_id":entity_id}, function(err,result){
        if (err) return console.log(err);

        let profileResult = {
            data : result
        };

        res.json(profileResult);
    })
};

export function update(req, res){
    let db = require('../../services/db/db.service').getDb();
    let entity_id = req.user.application_data.entity_id;
    let id = mongo.ObjectID(req.user.id);
    delete req.body._id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

