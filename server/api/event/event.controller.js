let mongo = require('mongodb');
let logging = require('../../services/logging/logging.service');
let config = require('../../config/configuration');
let className = 'entity.controller';

//event
export function list(req, res){
    let db = require('../../services/db/db.service').getDb();
    let logger = logging.Logger(className, get.name, config.log_level);

    let entity_id = req.user.entity_id;
    let eventQuery = {active:true, entity_id:entity_id};
    logger.DEBUG(config.information.COLLECTION_QUERY("event", eventQuery));

    db.collection('event').find(eventQuery).toArray(function(err, eventResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("event"));
        res.sendStatus(422);
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("event", eventResult));

          let eventResponse = {
            data: eventResult
          };

          res.json(eventResponse);
        }
      }
    })
}

export function get(req,res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);

    db.collection('event').find( {"_id" : id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../services/db/db.service').getDb();
    req.body.active = true;
    req.body.date_created = Date.now();
    //req.body.entity_id = req.params.entity_id;

    db.collection('event').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        res.json(entityResult);
    })
};

export function update(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('event').findOneAndUpdate({"_id":id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);

    db.collection('event').findOneAndUpdate({"_id":id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
