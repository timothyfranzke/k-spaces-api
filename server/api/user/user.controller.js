let mongo = require('mongodb');
var logging = require('../../services/logging/logging.service');
let className = 'user.controller';

export function list(req,res){
    let methodName = 'list';
    var entity_id = mongo.ObjectID(req.user.application_data.entity_id);
  
    logging.INFO(className,methodName,"entity_id : " + entity_id);
    let db = require('../../services/db/db.service').getDb();
    db.collection('entity').findOne({"active":true, "_id": entity_id })
    .then(function(entityResult)
    {
      logging.INFO(className, methodName, "found entity");
      logging.INFO(className, methodName, entityResult);
      if(entityResult.type === 'school'){
        logging.INFO(className,methodName, "entity type is school");
        db.collection('userDetail').find({"active":true, "entity_id":entity_id.str}).toArray(function(err, result){
          if (err) return console.log(err);

          res.json(result);
        })
      }
      else{
        logging.INFO(className,methodName, "entity type is vendor");
        var userEntityIds = entityResult.associated_entities;
        logging.INFO(className,methodName, "userEntityIds : " + userEntityIds);
        userEntityIds.push(entity_id.str);
        db.collection('userDetail').find({"entity_id": {$in: userEntityIds}}).toArray(function(err,userresult){
          if (err) return console.log(err);

          res.json(userresult);
        });
      }
    }, function(err){
      res.status(400);
    });

};

export function get(req,res){
    let methodName = 'get';
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    var entity_id = req.user.application_data.entity_id;

    logging.INFO(className,methodName,"entity_id : " + entity_id);

    db.collection('userDetail').find( {"_id" : id, "entity_id":entity_id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../services/db/db.service').getDb();
    let emailer = require('../../services/message/message.service');

    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.entity_id = req.user.application_data.entity_id;

    db.collection('userDetail').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        let message = {
            to: req.body.email,
            subject: "K-Spaces Account Created",
            body:"<p>An account has been created for you using this email</p><p>Please log in at k-spaces.herokuapp.com and enter the temporary password <b>"+ req.body.temp_password +"</b></p>"
        };

        emailer.sendEmail(message, res.json(entityResult));
    })
};


export function update(req, res){
    let db = require('../../services/db/db.service').getDb();
    var entity_id = req.user.application_data.entity_id;
    var id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../services/db/db.service').getDb();
    var id = mongo.ObjectID(req.params.id);
    var entity_id = req.user.application_data.entity_id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
