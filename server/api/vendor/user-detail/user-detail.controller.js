let mongo = require('mongodb');
let logging = require('../../../services/logging/logging.service');
let className = 'user-detail.controller';

export function list(req,res){
    let entity_id = req.user.entity_id;
    let user_id  = req.user.id;
    let db = require('../../../services/db/db.service').getDb();
    logging.INFO(className, list.name, JSON.stringify(req.user));
    console.log(req.user);

    if(req.user.roles[0] === 'user'){
      db.collection('userDetail').find({"active":true, "entity_id":entity_id, "parents" :{$in: studentIds}}).toArray(function(err, result){
        if (err) return console.log(err);

        let userDetailResult = {
          "data" : result
        };
        res.json(userDetailResult);
      })
    }

    if(req.user.roles[0] === ' faculty'){

      db.collection('spaces').findOne({"entity_id":true, "faculty":id}, function(result){
        logging.INFO(className, list.name, "space search for faculty " + id);
        console.log(result);
        if(result == null){
          res.sendStatus(422);
          logging.INFO(className, list.name, "no spaces listed for faculty user" + user_id);
        }
        let studentIds = [];
        result.students.forEach(function(student){
          studentIds.push(mongo.ObjectID(student));
        });
        db.collection('userDetail').find({"active":true, "entity_id":entity_id, "_id" :{$in: studentIds}}).toArray(function(err, result){
          if (err) return console.log(err);

          let userDetailResult = {
            "data" : result
          };
          res.json(userDetailResult);
        });
      });
    }


    db.collection('userDetail').find({"active":true, "entity_id":entity_id}).toArray(function(err, result){
        if (err) return console.log(err);

        let userDetailResult = {
            "data" : result
        };
        res.json(userDetailResult);
    })
};

export function get(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let entity_id = req.user.entity_id;

    db.collection('userDetail').find( {"_id" : id, "entity_id":entity_id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    let db = require('../../../services/db/db.service').getDb();
    let emailer = require('../../../services/message/message.service');
    if(req.body._id !== undefined){
      req.body._id = mongo.ObjectID(req.body._id);
    }

    req.body.active = true;
    req.body.date_created = Date.now();
    req.body.vendor_id = req.user.application_data.vendor_id;

    db.collection('userDetail').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        if(!!req.body.email)
        {
          let message = {
            to: req.body.email,
            subject: "K-Spaces Account Created",
            body:"<p>An account has been created for you using this email</p><p>Please log in at k-spaces.herokuapp.com and enter the temporary password <b>"+ req.body.temp_password +"</b></p>"
          };

          emailer.sendEmail(message, function(err, mailResponse){
            res.json(entityResult)
          });
        }
        else{
          res.json(entityResult);
        }
    })
};


export function update(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let vendor_id = req.user.application_data.vendor_id;
    let id = mongo.ObjectID(req.params.id);
    delete req.body._id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : req.body}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function remove(req, res){
    let db = require('../../../services/db/db.service').getDb();
    let id = mongo.ObjectID(req.params.id);
    let vendor_id = req.user.application_data.vendor_id;

    db.collection('userDetail').findOneAndUpdate({"_id":id, "vendor_id":vendor_id}, {$set : {"active":false}}, function(err, result){
        if (err) return console.log(err);

        res.json(result);
    })
};
