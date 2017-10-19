let mongo = require('mongodb');
let logging     = require('../../../services/logging/logging.service');
let className   = "tuition_rate.controller";

export function create(req,res){
  let methodName = "create";
  logging.INFO(className, methodName, "entering method");

  let db = require('../../../services/db/db.service').getDb();
  req.body.active = true;
  req.body.date_created = Date.now();
  req.body.entity_id = req.user.entity_id;

  try{
    db.collection('tuition_rate').insert(req.body, function(err, entityResult){
      if (err) {
        logging.ERROR(err, className, methodName, "database insert failed");

        res.status(400);
      }

      res.json(entityResult);
    });
  }
  catch (exception)
  {
    logging.ERROR(exception, className, methodName, "database insert exception");

    res.status(400);
  }
};

export function list(req,res){
  let methodName = "list";
  logging.INFO(className, methodName, "entering method");

  let entity_id = req.user.entity_id;
  logging.INFO(className, methodName, "EntityID: " + entity_id);

  let db = require('../../../services/db/db.service').getDb();
  try{
    db.collection('tuition_rate').find({"active":true, "entity_id":entity_id}).toArray(function(err, result){
      if (err){
        logging.ERROR(err, className, methodName, "database insert failed");

        res.status(400);
      }
      let tuitionRateResult = {
        data: result
      };
      res.json(tuitionRateResult);
    })
  }
  catch (exception)
  {
    logging.ERROR(exception, className, methodName, "database insert exception");

    res.status(400);
  }

};

export function update(req, res){
  let methodName = "update";

  try{
    let db = require('../../../services/db/db.service').getDb();
    let entity_id = req.user.entity_id;
    let id = mongo.ObjectID(req.params.id);

    delete req.body._id;

    db.collection('tuition_rate').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
      if (err) {
        logging.ERROR(err, className, methodName, "database insert failed");
        res.status(400);
      }
      if(req.body.students != null && req.body.students.length > 0){
        var studentIds = [];
        req.body.students.forEach(function(studentId){
          if(typeof studentId === 'string')
            studentIds.push(mongo.ObjectID(studentId));
        });
        let completedUpdates = 0;
        studentIds.forEach(function(studentId){
          db.collection('userDetail').update(
            { "_id": studentId },
            { $set: { tier_id : req.params.id } }
            , function(err, result){
              logging.INFO(className,methodName, "Updated student " + studentId + ". Result object: " + result);
              completedUpdates++;
              logging.INFO(className, methodName, "Completed update of student " + completedUpdates + " of " + studentIds.length);
              if(completedUpdates >= studentIds.length)
                res.json(result);
            })
        })

      }
      else{
        res.json(result);
      }

    })
  }
  catch (exception)
  {
    logging.ERROR(exception, className, methodName, "database insert exception");

    res.status(400);
  }
};

export function remove(req, res){
  let methodName = "remove";

  try {
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let entity_id = req.user.entity_id;

    db.collection('tuition_rate').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
      if (err) {
        logging.ERROR(err, className, methodName, "database insert failed");

        res.status(400);
      }

      res.json(result);
    })
  }
  catch (exception)
  {
    logging.ERROR(exception, className, methodName, "database insert exception");

    res.status(400);
  }
};

export function get(req,res){
  let methodName = "get";

  try {
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let entity_id = req.user.entity_id;

    db.collection('tuition_rate').find( {"_id" : id, "entity_id":entity_id, "active": true}).toArray(function(err,result){
      if (err) {
        logging.ERROR(err, className, methodName, "database insert failed");

        res.status(400);
      }

      res.json(result);
    })
  }
  catch (exception)
  {
    logging.ERROR(exception, className, methodName, "database insert exception");

    res.status(400);
  }
};

