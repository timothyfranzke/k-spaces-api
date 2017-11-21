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

export function create(req,res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);
  let space = new Space();
  space.name = req.body.name;
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
          if(req.body.location !== undefined){
            let spaceMember = {
              _id: spaceResult._id,
              type: config.enumerations.groupManagementTypes.SPACE
            };
            let locationGroup = {
              _id:req.body.location,
              type:config.enumerations.groupManagementTypes.LOCATION,
              group_members:[]
            };
            locationGroup.group_members.push(spaceMember);
            groupMgmt.create(locationGroup, function(err, groupMgmtLocationResponse){
              if (err){
                logger.ERROR(err, config.exceptions.COLLECTION_FAILED("group mgmt"));
              }
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
};
