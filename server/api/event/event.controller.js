let mongo = require('mongodb');
let objectID = require('mongodb').ObjectId;
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

  try {
    db.collection('event').find(eventQuery).toArray(function (err, eventResult) {
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
  catch(err){
    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));

    res.sendStatus(422);
  }
}

export function get(req,res){
  let db = require('../../services/db/db.service').getDb();
  var id = mongo.ObjectID(req.params.id);

  db.collection('event').find( {"_id" : id}).toArray(function(err,result){
    if (err) return console.log(err);

    res.json(result);
  })
}

export function create(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, create.name, config.log_level);

  req.body.active = true;
  req.body.date_created = Date.now();
  req.body.entity_id = req.user.entity_id;

  logger.DEBUG(config.information.COLLECTION_INSERT("event", req.body));

  try {
    db.collection('event').insert(req.body, function(err, eventResult){
      if (err){
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("event"));
        res.sendStatus(422);
      }
      else {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("event", eventResult));

        res.json(eventResult);
      }
    })
  }
  catch(err){
    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));

    res.sendStatus(422);
  }
}

export function update(req, res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, update.name, config.log_level);
  let event_id = objectID(req.params.id);
  delete req.body._id;

  let eventQuery = req.body;
  logger.DEBUG(config.information.COLLECTION_UPDATE("event", event_id, eventQuery));

  try{
    db.collection('event').findOneAndUpdate({_id:event_id}, {$set : req.body}, function(err, eventResult){
      if (err){
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("event"));
        res.sendStatus(422);
      }
      else {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("event", eventResult));

        res.json(eventResult);
      }
    })
  }
  catch(err){
    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("event"));

    res.sendStatus(422);
  }
}

export function remove(req, res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, remove.name, config.log_level);
  let event_id = objectID(req.params.id);

  let eventQuery = {active:false};
  logger.DEBUG(config.information.COLLECTION_UPDATE("event", event_id, eventQuery));

  try{
    db.collection('event').findOneAndUpdate({_id: event_id}, {$set : eventQuery}, function(err, eventResult){
      if (err){
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("event"));
        res.sendStatus(422);
      }
      else {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("event", eventResult));

        res.json(eventResult);
      }
    })
  }
  catch(err){
    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("event"));

    res.sendStatus(422);
  }
}
