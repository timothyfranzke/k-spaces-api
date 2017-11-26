let mongo = require('mongodb');

//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Entity  = require('../../models/entity');

//constants
const CLASS_NAME  = 'entity.v2.controller';

//Entity
export function get(req,res){
  let logger = logging.Logger(CLASS_NAME, get.name, config.log_level);
  let userId = req.user.id;
  let id = req.user.entity_id;

  logger.DEBUG(config.information.COLLECTION_QUERY('entity', id));

  Entity.findById(id)
    .exec(function(err, locationResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED('entity'));
        res.status(422);
        res.send(config.http_responses.exceptions.GET_ERROR('entity'))
      }
      else {
        {
          groupMgmt.getDetail(id, function(err, groupMgmtResponse){
            if (err) {
              logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Management'));
              res.status(422);
              res.send(config.http_responses.exceptions.GET_ERROR('entity'))
            }
            logger.DEBUG(config.log_formatter.api.information.GET_REQUEST('Group Management', groupMgmtResponse));

            let entityResponse = {};
            entityResponse.data = groupMgmtResponse.group;
            entityResponse.data.detail = entityResult;

            res.json(entityResponse);
          })
        }
      }
    });
}

export function associate(req, res){
  let logger = logging.Logger(CLASS_NAME, update.name, config.log_level);
  let entityId = req.user.entity_id;
  let associatedEntityId = req.params.entityId;

  groupMgmt.getFilteredDetail(entityId, config.enumerations.groupManagementTypes.REQUEST, function(err, groupMgmtResponse){
    if (err){
      logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Mgmt'));
      res.status(422);
      res.send(config.http_responses.exceptions.UPDATE_ERROR('entity'));
    }
    else {
      let requests = groupMgmtResponse.group.requests;

      requests.forEach(function(request){

      })
    }
  })

}

export function update(req, res){
  let logger = logging.Logger(CLASS_NAME, update.name, config.log_level);
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
