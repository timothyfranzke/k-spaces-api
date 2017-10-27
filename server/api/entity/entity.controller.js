let objectID = require('mongodb').ObjectId;
let logging = require('../../services/logging/logging.service');
let config = require('../../config/configuration');
let className = 'entity.controller';

export function get(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, get.name, config.log_level);

  let entity_id = mongo.ObjectID(req.params.id);
  let entityQuery = {_id : entity_id};
  logger.DEBUG(config.information.COLLECTION_QUERY("entity", entityQuery));

  try{
    db.collection('entity').find( entityQuery).toArray(function(err, entityResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));
        res.sendStatus(422);
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("entity", entityResult));

          let entityResponse = {
            data: entityResult
          };

          res.json(entityResponse);
        }
      }
    });
  }
  catch(err){
    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));

    res.sendStatus(422);
  }
}

export function create(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, create.name, config.log_level);

  req.body.active = true;
  req.body.date_created = Date.now();

  logger.DEBUG(config.information.COLLECTION_INSERT("entity", req.body));
  db.collection('entity').insert(req.body, function(err, entityResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));
      res.sendStatus(422);
    }
    else {
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("entity", entityResult));

      res.json(entityResult);
    }
  })
}

export function list(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, list.name, config.log_level);
  let entity_id =  objectID(req.user.entity_id);

  let entityQuery = {active:true, _id: entity_id };
  logger.DEBUG(config.information.COLLECTION_QUERY("entity", entityQuery));

  try{
    db.collection('entity').findOne(entityQuery)
      .then(function(entityResult)
      {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("entity", entityResult));
        if(entityResult === undefined && entityResult === null){
          logger.WARN(config.exceptions.COLLECTION_RETURNED_NULL("entity"));
          res.sendStatus(422);
        }
        else {
          let entityIds = entityResult.associated_entities.map(function(entityId){
            return objectID(entityId)
          });
          let entityQuery = {active:true, _id: { $in: entityIds}};
          logger.DEBUG(config.information.COLLECTION_QUERY("entity", entityQuery));

          db.collection('entity').find({"active":true, "_id": { $in: entityIds}}).toArray(function(err, entitiesResult){
            if (err){
              logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));
              res.sendStatus(422);
            }
            else{
              let locationQuery = {entity_id: {$in: entityResult.associated_entities}};
              logger.DEBUG(config.information.COLLECTION_QUERY("location", locationQuery));

              db.collection('location').find({"entity_id": {$in: entityResult.associated_entities}}).toArray(function(err, locationResult){
                if (err){
                  logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
                  res.sendStatus(422);
                }
                else {
                  let userDetailQuery = {entity_id: {$in: entityResult.associated_entities}};
                  logger.DEBUG(config.information.COLLECTION_QUERY("userDetail", userDetailQuery));

                  db.collection('userDetail').find(userDetailQuery).toArray(function(err,userDetailResult){
                    if (err){
                      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("userDetail"));
                      res.sendStatus(422);
                    }
                    else {
                      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("userDetail", userDetailResult));

                      let entityResponse = {
                        data : {
                          entity: entityResult,
                          locations: locationResult,
                          associated_entities:entitiesResult,
                          users:userDetailResult
                        }
                      };

                      res.json(entityResponse);
                    }
                  });
                }
              });
            }
          })
        }
      }, function(err){
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED(err, "entity"));

        res.sendStatus(400)
      });
  }
  catch(err){
    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));

    res.sendStatus(422);
  }
}

export function update(req, res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, create.name, config.log_level);

  let associatedEntityId = req.params.id;
  let entityId = objectID(req.user.entity_id);

  //let entityQuery = {{"_id":entityId}, {"$push":{"associated_entities":associatedEntityId}}};
  let entityQuery = {};
  logger.DEBUG(config.information.COLLECTION_QUERY("entity", entityQuery));

  db.collection('entity').findOneAndUpdate(entityQuery, function(err, entityResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("entity"));
      res.sendStatus(422);
    }
    else {
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("entity", entityResult));

      res.json(entityResult);
    }
  });
}

export function remove(req, res){
  let db = require('../../services/db/db.service').getDb();
  let id = req.params.id;
  let entity_id = mongo.ObjectID(req.user.entity_id);

  db.collection('entity').findOneAndUpdate({"_id":entity_id}, {$pop:{"associated_entities":id}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
}
