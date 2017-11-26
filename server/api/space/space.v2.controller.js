let mongo = require('mongodb');

//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Space  = require('../../models/space');
let Avatar   = require('../../models/avatar');

//constants
const CLASS_NAME  = 'space.v2.controller';

export function list(req,res) {
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);
  let entityId = req.user.entity_id;

  groupMgmt.getFilteredDetail(entityId, config.enumerations.groupManagementTypes.SPACE, function (err, spaceGroupResult) {
    if (err) {
      logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('group', err));
      res.status(422);
      res.send(config.http_responses.exceptions.GET_ERROR('space'))
    }
    else {
      {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT('note', spaceGroupResult));

        let spaceResponse = {
          data: spaceGroupResult.group.spaces

        };

        res.json(spaceResponse);
      }
    }
  });
}

export function get(req,res){
  let logger = logging.Logger(CLASS_NAME, get.name, config.log_level);
  let userId = req.user.id;
  let id = req.params.spaceId;

  logger.DEBUG(config.information.COLLECTION_QUERY('space', id));
  groupMgmt.isIdAMember(id, userId, function(isIdAMember){
    logger.DEBUG("retrieved callback from isIdMember : " + isIdAMember);
    if(isIdAMember || req.user.roles.indexOf(config.userRoles.ADMIN)){
      Space.findById(id)
        .exec(function(err, spaceResult){
          if (err) {
            logger.ERROR(err, config.exceptions.COLLECTION_FAILED('space'));
            res.status(422);
            res.send(config.http_responses.exceptions.GET_ERROR('space'))
          }
          else {
            {
              groupMgmt.getDetail(id, function(err, groupMgmtResponse){
                if (err) {
                  logger.ERROR(err, config.log_formatter.api.exceptions.GET_REQUEST('Group Management'));
                  res.status(422);
                  res.send(config.http_responses.exceptions.GET_ERROR('space'))
                }
                logger.DEBUG(config.log_formatter.api.information.GET_REQUEST('Group Management', groupMgmtResponse));

                let spaceResponse = {};
                spaceResponse.data = groupMgmtResponse.group;
                spaceResponse.data.detail = spaceResult;

                res.json(spaceResponse);
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
  let space = new Space();
  let locationId = req.body.location_id;
  let entityId = req.user.entity_id;
  if(locationId ===undefined){
    res.status(422);
    res.send("Location ID required");
  }
  else {
    space.name = req.body.name;
    space.avatar = new Avatar(req.body.avatar);
    space.required_number_of_faculty = req.body.required_number_of_faculty;
    space.max_number_of_students = req.body.max_number_of_students;

    space.save(function(err, spaceResult){
      if (err){
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("space"));
        res.sendStatus(422);
      }
      else {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("space", spaceResult));

        let spacesGroupList = [];
        if(req.body.students !== undefined || req.body.faculty !== undefined){
          if(req.body.students !== undefined) {
            req.body.students.forEach(function (studentId) {
              let spacesGroupObject = {
                _id: studentId,
                type: config.enumerations.groupManagementTypes.STUDENT
              };
              spacesGroupList.push(spacesGroupObject);
            });
          }
          if(req.body.faculty !== undefined) {
            req.body.faculty.forEach(function (facultyId) {
              let spacesGroupObject = {
                _id: facultyId,
                type: config.enumerations.groupManagementTypes.FACULTY
              };
              spacesGroupList.push(spacesGroupObject);
            });
          }
          let spaceGroup = {
            _id:spaceResult._id,
            type:config.enumerations.groupManagementTypes.SPACE,
            group_members:spacesGroupList
          };
          groupMgmt.create(spaceGroup, function(err, groupMgmtResponse){
            if (err){
              logger.ERROR(err, config.exceptions.COLLECTION_FAILED("group mgmt"));
            }
            if(req.body.location_id !== undefined){
              let spaceMember = {
                _id: spaceResult._id,
                type: config.enumerations.groupManagementTypes.SPACE
              };
              let locationGroup = {
                _id:locationId,
                type:config.enumerations.groupManagementTypes.LOCATION,
                group_members:[]
              };
              locationGroup.group_members.push(spaceMember);
              groupMgmt.create(locationGroup, function(err, groupMgmtLocationResponse){
                if (err){
                  logger.ERROR(err, config.exceptions.COLLECTION_FAILED("group mgmt"));
                }
                let entityGroup = {
                  _id:entityId,
                  type:config.enumerations.groupManagementTypes.ENTITY,
                  group_members:[]
                };
                entityGroup.group_members.push(spaceMember);
                groupMgmt.create(entityGroup, function(err, groupMgmtEntityResponse){
                  if (err){
                    logger.ERROR(err, config.exceptions.COLLECTION_FAILED("group mgmt"));
                  }
                  res.sendStatus(201);
                });
              })
            }
            res.sendStatus(201);
          });
        }
        else {
          res.sendStatus(201);
        }
      }
    });
  }
};

export function update(req, res){
  let logger = logging.Logger(CLASS_NAME, update.name, config.log_level);

  Space.findById(id)
    .exec(function(err, spaceResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED('space'));
        res.status(422);
        res.send(config.http_responses.exceptions.GET_ERROR('space'))
      }
      else {
        spaceResult.name = req.body.name;
        space.avatar = new Avatar(req.body.avatar);
        space.required_number_of_faculty = req.body.required_number_of_faculty;
        space.max_number_of_students = req.body.max_number_of_students;

        let spacesGroupList = [];
        if(req.body.students_to_add !== undefined || req.body.faculty_to_add !== undefined) {
          if (req.body.students_to_add !== undefined) {
            req.body.students_to_add.forEach(function (studentId) {
              let spacesGroupObject = {
                _id: studentId,
                type: config.enumerations.groupManagementTypes.STUDENT
              };
              spacesGroupList.push(spacesGroupObject);
            });
          }
          if (req.body.faculty_to_add !== undefined) {
            req.body.faculty_to_add.forEach(function (facultyId) {
              let spacesGroupObject = {
                _id: facultyId,
                type: config.enumerations.groupManagementTypes.FACULTY
              };
              spacesGroupList.push(spacesGroupObject);
            });
          }
          let spaceGroup = {
            _id: spaceResult._id,
            type: config.enumerations.groupManagementTypes.SPACE,
            group_members: spacesGroupList
          };
          groupMgmt.create(spaceGroup, function (err, groupMgmtResponse) {
            if (req.body.students_to_remove !== undefined) {
              groupMgmt.removeMemberBulk(spaceResult._id, req.body.students_to_remove, function () {
                if (req.body.faculty_to_remove !== undefined) {
                  groupMgmt.removeMemberBulk(spaceResult._id, req.body.faculty_to_remove, function () {
                    sendOK()
                  });
                }
                else {
                  sendOK(null, res)
                }
              });
            }
            else {
              sendOK(null, res)
            }
          });
        }
        else{
          if (req.body.students_to_remove !== undefined) {
            groupMgmt.removeMemberBulk(spaceResult._id, req.body.students_to_remove, function () {
              if (req.body.faculty_to_remove !== undefined) {
                groupMgmt.removeMemberBulk(spaceResult._id, req.body.faculty_to_remove, function () {
                  sendOK(null, res)
                });
              }
              else {
                sendOK(null, res)
              }
            });
          }
          else {
            sendOK(null, res)
          }
        }
      }
    });
}

export function remove(req,res){
  let logger = logging.Logger(CLASS_NAME, remove.name, config.log_level);

  let id = req.params.spaceId;
  logger.DEBUG(config.information.COLLECTION_QUERY('space', id));

  Space.findById(id)
    .exec(function(err, spaceResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED('space'));
        res.status(422);
        res.send(config.http_responses.exceptions.UPDATE_ERROR('space'))
      }
      else {
        {
          spaceResult.is_active = false;
          spaceResult.save(function(err, result){
            if (err) {
              logger.ERROR(err, config.log_formatter.db.exceptions.COLLECTION_FAILED('space'));
              res.status(422);
              res.send(config.http_responses.exceptions.UPDATE_ERROR('space'))
            }
            else{
              sendOK(null, res);
            }
          })

        }
      }
    });
}

function sendOK(data, res){
  if(data){
    let spaceResponse = {
      data: data
    };

    res.json(spaceResponse);
  }
  else{
    res.sendStatus(200)
  }
}

