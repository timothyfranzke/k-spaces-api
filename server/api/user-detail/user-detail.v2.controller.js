//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let security  = require('../../services/tech-spaces-api/security.service');
let image     = require('../../services/tech-spaces-api/image.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let UserDetail  = require('../../models/userDetail');
let LegalName   = require('../../models/legalName');
let ContactInfo = require('../../models/contactInfo');
let Address     = require('../../models/address');


//constants
const CLASS_NAME  = 'user-detail.v2.controller';

export function list(req,res){
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);
  let user_id = req.user.id;
  let entityId = req.user.entity_id;

  logger.DEBUG(config.information.COLLECTION_QUERY("note", user_id));

  groupMgmt.getFilteredDetail(entityId, config.enumerations.groupManagementTypes.USER, function(err, groupManagementResult){
    if (err) {
      logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt', err));
      res.status(422);
      res.send(config.http_responses.exceptions.GET_ERROR('UserDetail'));
    }
    else {
      {
        logger.DEBUG(config.log_formatter.api.information.GET_REQUEST('Group Mgmt', groupManagementResult));

        let activityResponse = {
          data: groupManagementResult.group.users
        };

        res.json(activityResponse);
      }
    }
  });
}

export function create(req,res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let entityId = req.user.entity_id;

  let userRegistration = req.body.registration;
  userRegistration.application_data = {
    "entity_id":entityId
  };

  security.registerUser(userRegistration, function(err, userId){
    logger.DEBUG("security service response : " + userId);
    req.body.detail._id = userId;
    logger.INFO("new userDetail model : " + JSON.stringify(req.body.detail));
    let userDetail = new UserDetail(req.body.detail);
    logger.INFO("new userDetail model : " + JSON.stringify(userDetail));
    userDetail.application_data = req.user.application_data;
    userDetail.save(function(err, userDetailResponse){
      if (err){
        logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('UserDetail'));
        res.status(422);
        res.send(config.http_responses.exceptions.CREATE_ERROR('UserDetail'));
      }
      else{
        let entityGroup = {
          _id:entityId,
          type:config.enumerations.groupManagementTypes.ENTITY,
          group_members:[{
            _id:userId,
            type:config.enumerations.groupManagementTypes.USER
          }]
        };

        groupMgmt.create(entityGroup, function(err, groupResult){
          if (err){
            logger.ERROR(err, config.log_formatter.api.exceptions.POST_REQUEST('Group Mgmt'));
            res.status(422);
            res.send(config.http_responses.exceptions.CREATE_ERROR('UserDetail'));
          }
          else{
            let parentGroupList = [];
            if(req.body.students !== undefined) {
              req.body.students.forEach(function (studentId) {
                let parentGroupObect = {
                  _id: studentId,
                  type: config.enumerations.groupManagementTypes.STUDENT
                };
                parentGroupList.push(parentGroupObect);
              });
              let parentGroup = {
                _id:userId,
                type:config.enumerations.groupManagementTypes.PARENT,
                group_members:parentGroupList
              };
              groupMgmt.create(parentGroup, function(err, groupMgmtResponse) {
                if (err) {
                  logger.ERROR(err, config.exceptions.COLLECTION_FAILED("group mgmt"));
                }
                else {
                  res.sendStatus(201);
                }
              });
            }
            res.sendStatus(201);
          }
        })
      }
    })
  });
}

export function update(req, res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let entityId = req.user.entity_id;
  let userId = req.params.userId;
  let userDetail = new UserDetail(req.body);
  userDetail._id = userId;

  logger.DEBUG("searching ueser : " + JSON.stringify(userDetail));
  UserDetail.findById(userId, function(err, userDetailResponse){
    if (err || userDetailResponse == null){
      logger.ERROR(err, config.log_formatter.api.exceptions.POST_REQUEST('Group Mgmt'));
      res.status(422);
      res.send(config.http_responses.exceptions.UPDATE_ERROR('UserDetail'));
    }
    else{
      logger.DEBUG("retreived : "  + JSON.stringify(userDetailResponse));
      let add = req.body.address;
      userDetailResponse.address = new Address(add);
      userDetailResponse.legal_name = new LegalName(req.body.legal_name);
      userDetailResponse.contact_info = new ContactInfo(req.body.contact_info);
      userDetailResponse.gender       = req.body.gender;

      userDetailResponse.save(function(err, userUpdateResponse){
        if (req.body.students_to_add !== undefined) {
          let parentGroupList = [];

          req.body.students_to_add.forEach(function (studentId) {
            let parentGroupObject = {
              _id: studentId,
              type: config.enumerations.groupManagementTypes.STUDENT
            };
            parentGroupList.push(parentGroupObject);
          });
          let parentGroup = {
            _id: userId,
            type: config.enumerations.groupManagementTypes.USER,
            group_members: parentGroupList
          };
          groupMgmt.create(parentGroup, function (err, groupMgmtResponse) {
            if (req.body.students_to_remove !== undefined) {
              groupMgmt.removeMemberBulk(userId, req.body.students_to_remove, function () {
                res.sendStatus(200);
              });
            }
            else {
              res.sendStatus(200);
            }
          });
        }
        else {
          if (req.body.students_to_remove !== undefined) {
            groupMgmt.removeMemberBulk(userId, req.body.students_to_remove, function () {
              res.sendStatus(200);
            });
          }
          else{
            res.sendStatus(200);
          }
        }
      })
    }
  })
}

export function remove(req, res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let userId = req.params.userId;
  let userDetail = new UserDetail(req.body.detail);

  UserDetail.findByIdAndUpdate(userId, {is_active : false}, function(err, userDetailRespose){
    if (err){
      logger.ERROR(err, config.log_formatter.api.exceptions.POST_REQUEST('Group Mgmt'));
      res.status(422);
      res.send(config.http_responses.exceptions.UPDATE_ERROR('UserDetail'));
    }
    else{

      res.sendStatus(200);
    }
  })
}

