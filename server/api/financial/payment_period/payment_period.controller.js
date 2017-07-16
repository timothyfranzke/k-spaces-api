let mongo = require('mongodb');
let logging     = require('../../../services/logging/logging.service');
let financialService  = require('../../../services/financial/financial.service');
let className   = "payment_period.controller";

export function create(req,res){
  let methodName = "create";
  logging.INFO(className, methodName, "entering method");

  let db = require('../../../services/db/db.service').getDb();
  req.body.active = true;
  req.body.date_created = Date.now();
  req.body.entity_id = req.user.application_data.entity_id;
  let entity_id = req.body.entity_id;

  try{
    financialService.createPayPeriodRecord(req.body.entity_id, function(err, result){
      if(err) {
        logging.ERROR(err, className, methodName, "error while creating pay period");
        res.sendStatus(400);
      }
      else{
        logging.INFO(className, methodName, "result from createPayPeriodRecord " + result);
        db.collection('user').find({"active":true, "entity_id":entity_id, "is_primary":true}).toArray(function(err, user_result){
          logging.INFO(className,methodName,"query for users. Found " + user_result.length);
          if(err) {
            logging.ERROR(err, className, methodName, "error while creating pay period");
            res.sendStatus(400);
          }
          var userCount = user_result.length;
          var usersProcessed = 0;
          user_result.forEach(function(user){
            usersProcessed ++;
            logging.INFO(className, methodName, "Processing user " + usersProcessed);
            financialService.createPaymentRecord(entity_id, result, user, function(err, paymentId){
              if(usersProcessed == userCount)
              {
                financialService.addStudentPayments(req.body.entity_id, result, function(err, studentPaymentResult){
                  if(err){
                    logging.ERROR(err, className, methodName, "error while updating parent records");
                    res.sendStatus(400);
                  }
                  else{
                    res.sendStatus(200);
                  }
                });
              }
          });
          });
        });
      }
    })
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

  let entity_id = req.user.application_data.entity_id;
  logging.INFO(className, methodName, "EntityID: " + entity_id);

  let db = require('../../../services/db/db.service').getDb();
  try{
    db.collection('payment').find({"entity_id":entity_id}).toArray(function(err, result){
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
    let entity_id = req.user.application_data.entity_id;
    let id = mongo.ObjectID(req.params.id);

    delete req.body._id;

    db.collection('tuition_rate').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
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

export function remove(req, res){
  let methodName = "remove";

  try {
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let entity_id = req.user.application_data.entity_id;

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
    let entity_id = req.user.application_data.entity_id;

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
