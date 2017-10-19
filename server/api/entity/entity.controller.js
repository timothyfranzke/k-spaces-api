let mongo = require('mongodb');
var logging = require('../../services/logging/logging.service');
let className = 'entity.controller';

export function get(req,res){
  var id = mongo.ObjectID(req.params.id);
  db.collection('entity').find( {"_id" : id}).toArray(function(err,result){
    if (err) return console.log(err);

    res.json(result);
  })
};

export function create(req,res){
  req.body.active = true;
  req.body.date_created = Date.now();

  db.collection('entity').insert(req.body, function(err, entityResult){
    if (err) return console.log(err);

    res.json(entityResult);
  })
};

export function list(req,res){
  let methodName = 'list';
  let db = require('../../services/db/db.service').getDb();
  //let id = mongo.ObjectID(req.params.id);
  let entity_id =  mongo.ObjectID(req.user.entity_id);


  logging.INFO(className, methodName, "entity id in the header" + req.user.entity_id);
  db.collection('entity').findOne({"active":true, "_id": entity_id })
    .then(function(entityResult)
    {
      logging.INFO(className,methodName,entityResult.associated_entities);
      var entityIds = [];
      entityResult.associated_entities.forEach(function(associatedEntity){
        entityIds.push(mongo.ObjectID(associatedEntity));
      });
      db.collection('entity').find({"active":true, "_id": { $in: entityIds}}).toArray(function(err, entitiesResult){
        if (err) {
          logging.ERROR(className,methodName,err);
          res.status(400)
        }
        else{
          db.collection('location').find({"entity_id": {$in: entityResult.associated_entities}}).toArray(function(err,locationsresult){
            db.collection('userDetail').find({"entity_id": {$in: entityResult.associated_entities}}).toArray(function(err,userresult){
              if (err) return console.log(err);

              let result = {
                data : {
                  entity: entityResult,
                  locations: locationsresult,
                  associated_entities:entitiesResult,
                  users:userresult
                }
              };
              res.json(result);
            });
          });

        }
      })

    }, function(err){
      logging.ERROR(err, className, methodName);
      res.sendStatus(400)
    });

};

export function update(req, res){
  let db = require('../../services/db/db.service').getDb();
  let id = req.params.id;
  let entity_id = mongo.ObjectID(req.user.entity_id);

  db.collection('entity').findOneAndUpdate({"_id":entity_id}, {$push:{"associated_entities":id}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};

export function remove(req, res){
  let db = require('../../services/db/db.service').getDb();
  let id = req.params.id;
  let entity_id = mongo.ObjectID(req.user.entity_id);

  db.collection('entity').findOneAndUpdate({"_id":entity_id}, {$pop:{"associated_entities":id}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};
