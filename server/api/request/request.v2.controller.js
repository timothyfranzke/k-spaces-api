//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Request  = require('../../models/request');

//constants
const CLASS_NAME  = 'request.v2.controller';

export function send(req, res){
  let logger = logging.Logger(CLASS_NAME, send.name, config.log_level);

  let request = new Request(req.body);
  request.save(function(err, requestResponse){
    if (err){
      logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('request'));
      res.status(422);
      res.send(config.http_responses.exceptions.CREATE_ERROR('request'));
    }
    else{
      let requestGroup = {
        _id: requestResponse._id,
        type: config.enumerations.groupManagementTypes.REQUEST,
        group_members:[]
      };
      requestGroup.group_members.push(request.to);

      groupMgmt.create(requestGroup, function(err, groupMgmtResponse){
        if (err){
          logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt'));
          res.status(422);
          res.send(config.http_responses.exceptions.UPDATE_ERROR('entity'));
        }
        else {
          res.status(201);
          res.send(requestResponse._id);
        }
      })
    }
  })
}

export function accept(req, res){
  let logger = logging.Logger(CLASS_NAME, accept.name, config.log_level);
  let requestId = req.params.requestId;
  let entityId = req.user.entity_id;
  let userId = req.user.id;

  Request.findById(requestId)
    .exec(function(err, requestResult){
      if (err){
        logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('request'));
        res.status(422);
        res.send(config.http_responses.exceptions.UPDATE_ERROR('request'));
      }
      else {
        if(requestResult.to._id === entityId || requestResult.to._id === userId){
          let requestGroup = requestResult.from;
          requestGroup.group_members = [];
          requestGroup.group_members.push(request.to);
          groupMgmt.create(requestGroup, function(err, groupMgmtCreateResult){
            if (err){
              logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt'));
              res.status(422);
              res.send(config.http_responses.exceptions.UPDATE_ERROR('request'));
            }
            else {
              groupMgmt.removeMember(requestId, requestResult.to._id, function(err, groupMgmtRemoveResult){
                if (err){
                  logger.ERROR(err, config.log_formatter.api.exceptions.DELETE_REQUEST('Group Mgmt'));
                }
                requestResult.is_active = false;
                requestResult.save(function(err, requestUpdateReuslt){
                  if (err){
                    logger.ERROR(err, config.log_formatter.api.exceptions.DELETE_REQUEST('Group Mgmt'));
                  }
                  res.sendStatus(200);
                })
              })
            }
          })
        }
        else{
          res.sendStatus(403);
        }
      }
    });
}
