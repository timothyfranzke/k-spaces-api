let mongo = require('mongodb');

//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Location  = require('../../models/location');
let Address   = require('../../models/address');
let Avatar    = require('../../models/avatar');
let Hours     = require('../../models/hours');
let DaysOfWeek  = require('../../models/daysOfWeek');

//constants
const CLASS_NAME  = 'location.v2.controller';

//location
export function list(req,res){
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);
  let entityId = req.user.entity_id;

  logger.DEBUG(config.information.COLLECTION_QUERY("note", user_id));

  groupMgmt.getFilteredDetail(entityId, config.enumerations.groupManagementTypes.LOCATION, function(err, groupManagementResult){
    if (err) {
      logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt', err));
      res.status(422);
      res.send(config.http_responses.exceptions.GET_ERROR('Location'));
    }
    else {
      {
        logger.DEBUG(config.log_formatter.api.information.GET_REQUEST('Group Mgmt', groupManagementResult));

        let locationResponse = {
          data: groupManagementResult.groupMembers.Location
        };

        res.json(locationResponse);
      }
    }
  });
}

export function get(req,res){
  let logger = logging.Logger(CLASS_NAME, get.name, config.log_level);
  let userId = req.user.id;
  let id = req.params.locationId;

  logger.DEBUG(config.information.COLLECTION_QUERY('location', id));
  groupMgmt.isIdAMember(id, userId, function(isIdAMember){
    logger.DEBUG("retrieved callback from isIdMember : " + isIdAMember);
    if(isIdAMember || req.user.roles.indexOf(config.userRoles.ADMIN)){
      Location.findById(id)
        .exec(function(err, locationResult){
          if (err) {
            logger.ERROR(err, config.exceptions.COLLECTION_FAILED('location'));
            res.status(422);
            res.send(config.http_responses.exceptions.GET_ERROR('location'))
          }
          else {
            {
              groupMgmt.getDetail(id, function(err, groupMgmtResponse){
                if (err) {
                  logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Management'));
                  res.status(422);
                  res.send(config.http_responses.exceptions.GET_ERROR('location'))
                }
                logger.DEBUG(config.log_formatter.api.information.GET_REQUEST('Group Management', groupMgmtResponse));

                let locationResponse = {};
                locationResponse.data = groupMgmtResponse.group;
                locationResponse.data.detail = locationResult;

                res.json(locationResponse);
              })
            }
          }
        });
    }
    else {
      res.sendStatus(403);
    }
  });
}

export function create(req,res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let entityId = req.user.entity_id;
  req.body.active = true;
  req.body.date_created = Date.now();
  let location = new Location(req.body);

  location.save(function(err, locationResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
      res.sendStatus(422);
    }
    else {
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("location", locationResult));

      let spacesGroupList = [];
      if(req.body.spaces !== undefined){
        req.body.spaces.forEach(function(spaceId){
          let spacesGroupObject = {
            _id:spaceId,
            type:config.enumerations.groupManagementTypes.SPACE
          };
          spacesGroupList.push(spacesGroupObject);
        });
        let locationGroup = {
          _id:locationResult._id,
          type:config.enumerations.groupManagementTypes.LOCATION,
          group_members:spacesGroupList
        };
        groupMgmt.create(locationGroup, function(err, groupMgmtResponse){
          if (err){
            logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
          }

          let entityGroup = {
            _id:entityId,
            type:config.enumerations.groupManagementTypes.ENTITY,
            group_members:[
              {
                _id:locationResult._id,
                type:config.enumerations.groupManagementTypes.LOCATION
              }
            ]
          };
          groupMgmt.create(entityGroup, function(err, groupMgmtEntityResponse){
            if (err){
              logger.ERROR(err, config.log_formatter.api.exceptions.POST_REQUEST('Group Mgmt'));
              res.status(422);
              res.send(config.http_responses.exceptions.CREATE_ERROR('location'))
            }
            else{
              res.sendStatus(201);
            }
          });
        });
      }
      else {
        let entityGroup = {
          _id:entityId,
          type:config.enumerations.groupManagementTypes.ENTITY,
          group_members:[
            {
              _id:locationResult._id,
              type:config.enumerations.groupManagementTypes.LOCATION
            }
          ]
        };
        groupMgmt.create(entityGroup, function(err, groupMgmtEntityResponse){
          if (err){
            logger.ERROR(err, config.log_formatter.api.exceptions.POST_REQUEST('Group Mgmt'));
            res.status(422);
            res.send(config.http_responses.exceptions.CREATE_ERROR('location'))
          }
          else{
            res.sendStatus(201);
          }
        });
      }
    }
  });
}

export function update(req, res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let entityId = req.user.entity_id;
  let userId = req.params.userId;
  let id = req.params.idl

  Location.findByIdAndUpdate(userId, req.body, function(err, locationResponse){
    if (err){
      logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('location'));
      res.status(422);
      res.send(config.http_responses.exceptions.UPDATE_ERROR('Location'));
    }
    else{
      let locationGroupList = [];
      if (req.body.spaces_to_add !== undefined) {
        req.body.spaces_to_add.forEach(function (spaceId) {
          let spaceGroupObject = {
            _id: spaceId,
            type: config.enumerations.groupManagementTypes.SPACE
          };
          locationGroupList.push(spaceGroupObject);
        });
        let locationGroup = {
          _id: id,
          type: config.enumerations.groupManagementTypes.LOCATION,
          group_members: locationGroupList
        };
        groupMgmt.create(locationGroup, function (err, groupMgmtResponse) {
          if (req.body.spaces_to_remove !== undefined) {
            groupMgmt.removeMemberBulk(id, req.body.spaces_to_remove, function () {
              res.sendStatus(200);
            });
          }
        });
      }
      else{
        res.sendStatus(200);
      }

    }
  })
}

export function remove(req, res){
  let logger = logging.Logger(CLASS_NAME, remove.name, config.log_level);

  let id = req.params.locationId;
  logger.DEBUG(config.information.COLLECTION_QUERY('location', id));

  Location.findById(id)
    .exec(function(err, locationResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED('location'));
        res.status(422);
        res.send(config.http_responses.exceptions.UPDATE_ERROR('location'))
      }
      else {
        {
          locationResult.is_active = false;
          locationResult.save(function(err, result){
            if (err) {
              logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('location'));
              res.status(422);
              res.send(config.http_responses.exceptions.UPDATE_ERROR('location'))
            }
            else{
              sendOK(null, res);
            }
          })

        }
      }
    });
}
