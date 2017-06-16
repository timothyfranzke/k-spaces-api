let mongo = require('mongodb');
let emailer = require('../../services/message/message.service');
let db = require('../../services/db/db.service').getDb();

export function list(req,res){
    let db = require('../../services/db/db.service').getDb();
    let entity_id = req.user.application_data.entity_id;

    db.collection('message').find({"active":true, "entity_id": entity_id}).toArray(function(err, result){
        if (err) return console.log(err);

        console.log(result);
        result.forEach((item) => {
            console.log(item.from_id);
            item.from_id === req.user.id ? item.isSent = true : item.isSent = false;
        });

        res.json(result);
    })
};

export function get(req,res){
    let db = require('../../services/db/db.service').getDb();

    db.collection('message').find({"to_id":req.user.id}).toArray( function(err, messageResult){
        if (err) return console.log(err);

        res.json(messageResult);
    })
};

export function send(req,res){
    let db = require('../../services/db/db.service').getDb();

    req.body.active = true;
    req.body.date_created = Date.now();

    let message = {};
    message.active = true;
    message.date_created = Date.now();
    message.to = req.body.to;
    message.subject = req.body.subject;
    message.body = req.body.body;
    message.from_id = req.user.id;
    message.to_id = '4566';
    message.type = req.body.type;
    message.hasRead = false;
    message.parent_id = null;
    message.entity_id = req.user.application_data.entity_id;

    db.collection('message').insert(message, function(err, messageResult){
        if (err) return console.log(err);

        console.log(messageResult);
        if(req.body.email)
        {
            let messageObject = messageResult.ops[0];
            let messageId = mongo.ObjectID(message._id);
            emailer.sendEmail(messageObject, function(err, result){
                if(err)
                    res.sendStatus(400);

                db.collection('message').findOneAndUpdate({"_id":messageId}, {$set : {sent_date: Date.now()}}, function(err, messageUpdateResult){
                    if (err)
                        console.log(err);
                    res.json(messageUpdateResult.value);
                });
            });
        }
    });
}

export function remove(req, res){
    let db = require('../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let entity_id = req.user.application_data.entity_id;

    db.collection('message').findOneAndUpdate({"_id":id, "entity_id":entity_id }, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

