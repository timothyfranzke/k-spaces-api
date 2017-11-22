let mongo = require('mongodb');

//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Note  = require('../../models/note');

//constants
const CLASS_NAME  = 'note.v2.controller';

//location
export function list(req,res){
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);
  let user_id = req.user.id;

  logger.DEBUG(config.information.COLLECTION_QUERY("note", user_id));

  groupMgmt.getFilteredDetail(user_id, config.enumerations.groupManagementTypes.NOTE, function(err, groupManagementResult){
    if (err) {
      logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt', err));
      res.status(422);
      res.send(config.http_responses.exceptions.GET_ERROR('note'));
    }
    else {
      {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT('note', groupManagementResult));

        let activityResponse = {
          data: groupManagementResult.memberOf.Note
        };

        res.json(activityResponse);
      }
    }
  });
}

export function get(req,res){
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);

  let id = req.params.noteId;
  logger.DEBUG(config.information.COLLECTION_QUERY('note', id));

  Note.findById(id)
    .exec(function(err, noteResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED('note'));
        res.status(422);
        res.send(config.http_responses.exceptions.GET_ERROR('note'))
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT('note', noteResult));

          let noteResponse = {
            data: noteResult

          };

          res.json(noteResponse);
        }
      }
    });
}

export function create(req,res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let userId = req.user.id;

  req.body.active = true;
  req.body.date_created = Date.now();
  let note = new Note(req.body);

  note.save(function(err, noteResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("note"));
      res.sendStatus(422);
    }
    else {
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("note", noteResult));

      groupMgmt.getDetail(userId, function(err, userGroupResponse){
        if (err || userGroupResponse.memberOf.Spaces === undefined){
          logger.ERROR(err, config.exceptions.COLLECTION_FAILED("note"));
          res.status(422)
          res.send(config.http_responses.exceptions.CREATE_ERROR('note'));
        }
        else {
          let noteGroup = {
            _id:noteResult._id,
            type:config.enumerations.groupManagementTypes.NOTE,
            group_members:[
              {_id:userId, type:config.enumerations.groupManagementTypes.FACULTY},
              {_id:userGroupResponse.memberOf.Spaces[0]._id, type:config.enumerations.groupManagementTypes.SPACE}
            ]
          };
          req.body.students.forEach(function(studentId){
            let studentMember = {_id:studentId, type:config.enumerations.groupManagementTypes.STUDENT}
            noteGroup.group_members.push(studentMember)
          });
          groupMgmt.create(noteGroup, function(err, groupMgmtResponse){
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
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);
  let id =  req.params.id;

  logger.DEBUG(config.information.COLLECTION_QUERY("note", id));

  Note.findByIdAndUpdate(id, {is_active : false}, function(err, noteUpdateResult){
    if(err){
      logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('note'));
      res.status(422);
      res.send(config.http_responses.exceptions.UPDATE_ERROR('note'));
    }
    else{
      res.status(200);
      res.send(config.http_responses.information.REMOVE_SUCCESS('note'));
    }
  });
}
