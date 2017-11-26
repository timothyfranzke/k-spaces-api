//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let security  = require('../../services/tech-spaces-api/security.service');
let image     = require('../../services/tech-spaces-api/image.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let UserDetail  = require('../../models/userDetail');

//constants
const CLASS_NAME  = 'profile.v2.controller';

export function get(req, res){
  let logger = logging.Logger(CLASS_NAME, get.name, config.log_level);
  let userId = req.user.id;

  logger.DEBUG(config.information.COLLECTION_QUERY("note", userId));

  groupMgmt.getDetail(userId, function(err, groupResponse){
    if (err) {
      logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt', err));
      res.status(422);
      res.send(config.http_responses.exceptions.GET_ERROR('profile'));
    }
    else {
      security.getUserData(userId, function(err, securityResponse){
        if (err) {
          logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Security', err));
          res.status(422);
          res.send(config.http_responses.exceptions.GET_ERROR('profile'));
        }
        else {
          UserDetail.findById(userId)
            .exec(function(err, userDetailResponse){
              if (err) {
                logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('UserDetail'));
                res.status(422);
                res.send(config.http_responses.exceptions.GET_ERROR('profile'));
              }
              else {

                let profileResponse ={
                  data:{
                  }
                };
                profileResponse.data = groupResponse.group;
                profileResponse.data.detail = userDetailResponse;
                profileResponse.data.security = securityResponse;

                res.json(profileResponse);
              }
            })
        }
      })
    }
  })
}

export function update(req, res){
  let logger = logging.Logger(CLASS_NAME, update.name, config.log_level);
  let userId = req.user.id;

  logger.DEBUG(config.log_formatter.db.information.COLLECTION_QUERY(userId));
  UserDetail.findById(userId)
    .exec(function(err, userDetailResult){
      if (err) {
        logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('UserDetail'));
        res.status(422);
        res.send(config.http_responses.exceptions.UPDATE_ERROR('profile'));
      }
      else{
        userDetailResult = new UserDetail(req.body);
        userDetailResult.save(function(err, userSaveResponse){
          if (err) {
            logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('UserDetail'));
            res.status(422);
            res.send(config.http_responses.exceptions.UPDATE_ERROR('profile'));
          }
          else{
            res.status(200);
            res.send("User Updated Successfully")
          }
        })
      }
    })
}
