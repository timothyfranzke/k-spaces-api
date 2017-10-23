let mongo = require('mongodb');
let logging = require('../../services/logging/logging.service');
let className = 'user-detail.controller';

export function list(req,res){
  let entity_id = mongo.ObjectID(req.user.entity_id);
  let id = req.user.id
  let db = require('../../services/db/db.service').getDb();

  logging.INFO(className, list.name, "entity_id : " + entity_id);
  db.collection('entity').findOne({"active":true, "_id": entity_id })
    .then(function(entityResult)
    {
      logging.INFO(className, list.name, "found entity");
      logging.INFO(className, list.name, entityResult);
      if(entityResult.type === 'school'){
        logging.INFO(className, list.name, "entity type is school");

        if(req.user.roles[0] === 'user'){
          logging.INFO(className, list.name, "user is type user");
          db.collection('userDetail').find({"active":true, "entity_id":entity_id, "parents" :{$in: studentIds}}).toArray(function(err, result){
            if (err) return console.log(err);

            let userDetailResult = {
              "data" : result
            };
            res.json(userDetailResult);
          })
        }

        if(req.user.roles[0] === 'faculty'){
          logging.INFO(className, list.name, "user is type faculty");
          db.collection('spaces').find({"entity_id":entity_id}).toArray(function(err, result){

            logging.INFO(className, list.name, "space search for faculty " + id);
            console.log(result);
            if(result == null){
              logging.INFO(className, list.name, "no spaces listed for faculty user" + id);
              return res.sendStatus(422);
            }
            let studentIDStrings = [];
            result.forEach(function(space){
              if(space.faculty.contains(id)) {
                logging.INFO(className, list.name, "searching faculty " + id + " searching space " + space._id);
                if(space.students !== undefined){
                  studentIDStrings = space.students;
                }

              }
              })
            });
            let studentIds = [];
            studentIDStrings.forEach(function(student){
              studentIds.push(mongo.ObjectID(student));
            });
            db.collection('userDetail').find({"active":true, "entity_id":entity_id, "_id" :{$in: studentIds}}).toArray(function(err, result){
              if (err) return console.log(err);

              let userDetailResult = {
                "data" : result
              };
              res.json(userDetailResult);
            });
        }


        logging.INFO(className, list.name, "user is admin");
        db.collection('userDetail').find({"active":true, "entity_id":entity_id.str}).toArray(function(err, result){
          if (err) return console.log(err);

          let userResult = {
            data : result
          };

          res.json(userResult);
        })
      }
      else{
        logging.INFO(className,list.name, "entity type is vendor");
        var userEntityIds = entityResult.associated_entities;
        logging.INFO(className,list.name, "userEntityIds : " + userEntityIds);
        userEntityIds.push(entity_id.str);
        db.collection('userDetail').find({"entity_id": {$in: userEntityIds}}).toArray(function(err,result){
          if (err) return console.log(err);

          let userResult = {
            data : result
          };

          res.json(userResult);
        });
      }
    }, function(err){
      logging.ERROR(err, className, list.name, "call to entity collection failed");
      res.status(400);
    });
};

export function get(req,res){
  let db = require('../../services/db/db.service').getDb();
  var id = mongo.ObjectID(req.params.id);
  var entity_id = req.user.entity_id;

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
  req.body.entity_id = req.user.entity_id;

  db.collection('userDetail').insert(req.body, function(err, entityResult){
    if (err) return console.log(err);

    if(!!req.body.email)
    {
      let message = {
        to: req.body.email,
        subject: "K-Spaces Account Created",
        body:"<p>An account has been created for you using this email</p><p>Please log in at k-spaces.herokuapp.com and enter the temporary password <b>"+ req.body.temp_password +"</b></p>"
      };

      try{
        emailer.sendEmail(message, function(err, mailResponse){
          if(!!err){
            logging.ERROR(err, className, create.name);
          }

          res.json(entityResult)
        });
      }
      catch(exception){
        logging.ERROR(exception, className, create.name);
        res.status(422);
      }

    }
    else{
      res.json(entityResult);
    }
  })
};


export function update(req, res){
  let db = require('../../services/db/db.service').getDb();
  var entity_id = req.user.entity_id;
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
  var entity_id = req.user.entity_id;

  db.collection('userDetail').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};
