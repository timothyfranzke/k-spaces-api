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
  let user_id = req.user.id;

  logger.DEBUG(config.information.COLLECTION_QUERY("activity", user_id));

  groupMgmt.getFilteredDetail(user_id, config.enumerations.groupManagementTypes.ACTIVITY, function(err, groupManagementResult){
      if (err) {
        logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt', err));
        res.status(422);
        res.send(config.http_responses.exceptions.GET_ERROR('Activity'));
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT('activity', groupManagementResult));

          let activityResponse = {
            data: groupManagementResult.group.activities
          };

          res.json(activityResponse);
        }
      }
    });
}

export function get(req,res){
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);

  let id = req.params.activityId;
  logger.DEBUG(config.information.COLLECTION_QUERY('activity', id));

  Activity.findById(id)
    .exec(function(err, activityResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED('activity'));
        res.status(422);
        res.send(config.http_responses.exceptions.GET_ERROR('activity'))
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT('activity', activityResult));

          let locationResponse = {
            data: activityResult

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
}

export function remove(req, res){
  let logger = logging.Logger(className, list.name, config.log_level);
  let id =  req.params.id;

  let entityQuery = {active:true, _id: entity_id };
  logger.DEBUG(config.information.COLLECTION_QUERY("location", entityQuery));

  Activity.findByIdAndUpdate(id, {is_active : false}, function(err, activityUpdateResponse){
    if(err){
      logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('activity'));
      res.status(422);
      res.send(config.http_responses.exceptions.UPDATE_ERROR('activity'));
    }
    else{
      res.status(200);
      res.send(config.http_responses.information.REMOVE_SUCCESS('activity'));
    }
  });
}
