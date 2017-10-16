let mongo = require('mongodb');
let logging     = require('../../../services/logging/logging.service');

export function get(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let id = req.user.id;

    let entity_id = req.user.application_data.entity_id;

    db.collection('userDetail').findOne( {"auth_id" : id, "entity_id":entity_id}, function(err,result){
        if (err) return console.log(err);

        let profileResult = {
            data : result
        };

        res.json(profileResult);
    })
};

export function update(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let entity_id = req.user.application_data.entity_id;
    let auth_id = req.user.id;


    logging.INFO("profile.controller", "update", "updating user " + auth_id + " of entity " + entity_id);

    delete req.body._id;

    db.collection('userDetail').findOneAndUpdate({"auth_id":auth_id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

