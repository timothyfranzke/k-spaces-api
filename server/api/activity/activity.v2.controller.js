let mongo = require('mongodb');

//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Activity  = require('../../models/activity');

//constants
const CLASS_NAME  = 'activity.v2.controller';

//location
export function list(req,res){
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);

  let entity_id = req.user.entity_id;
  logger.DEBUG(config.information.COLLECTION_QUERY("activity", entity_id));

  Location.find({entity_id:entity_id, is_active:true})
    .exec(function(err, locationResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
        res.sendStatus(422);
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("location", locationResult));

          let locationResponse = {
            data: locationResult
          };

          res.json(locationResponse);
        }
      }
    });
}

export function get(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);

  let id = req.params.id;
  logger.DEBUG(config.information.COLLECTION_QUERY("location", id));


  Location.findById(id)
    .exec(function(err, locationResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
        res.sendStatus(422);
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("location", locationResult));

          let locationResponse = {
            data: {
              location  : locationResult,
              group     : groupMgmt.get(id)
            }
          };

          res.json(locationResponse);
        }
      }
    });
}

export function create(req,res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let studentId = req.params.studentId;
  let userId = req.user.id;

  req.body.active = true;
  req.body.date_created = Date.now();
  let activity = new Activity(req.body);

  activity.save(function(err, activityResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("activity"));
      res.sendStatus(422);
    }
    else {
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("activity", activityResult));

      groupMgmt.getDetail(studentId, function(err, userGroupResponse){
        if (err || userGroupResponse.memberOf.Spaces === undefined){
          logger.ERROR(err, config.exceptions.COLLECTION_FAILED("activity"));
          res.send(422, "User is not part of space")
        }
        else {
          let activityGroup = {
            _id:activityResult._id,
            type:config.enumerations.groupManagementTypes.ACTIVITY,
            group_members:[
              {_id:studentId, type:config.enumerations.groupManagementTypes.STUDENT},
              {_id:userId, type:config.enumerations.groupManagementTypes.FACULTY},
              {_id:userGroupResponse.memberOf.Spaces[0]._id, type:config.enumerations.groupManagementTypes.SPACE}
            ]
          };
          groupMgmt.create(activityGroup, function(err, groupMgmtResponse){
            if (err){
              logger.ERROR(err, config.exceptions.COLLECTION_FAILED("groupMgmt"));
            }

            res.sendStatus(201);
          });
        }
      });
    }
  });
};

export function update(req, res){
  let db = require('../../services/db/db.service').getDb();
  var id = mongo.ObjectID(req.params.id);
  delete req.body._id;
  var entity_id = req.user.entity_id;

  db.collection('location').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};

export function remove(req, res){
  let db = require('../../services/db/db.service').getDb();
  var id = mongo.ObjectID(req.params.id);
  var entity_id = req.user.entity_id;

  db.collection('location').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};
