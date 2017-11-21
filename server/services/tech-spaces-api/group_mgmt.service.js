let axios     = require('axios');

//services
let logging   = require('../logging/logging.service');
let event     = require('./event.service');
let avatar    = require('./image.service.js');
let security  = require('./security.service');

let config             = require('../../config/configuration');
let groupMgmtConfig    = config.apis.group_mgmt;
let formatter          = config.log_formatter.api;
let enums              = config.enumerations;

//models
let User              = require('../../models/userDetail');
let Location          = require('../../models/location');
let Space             = require('../../models/space');
let Activity          = require('../../models/activity');

//constants
const className = 'group_mgmt.service';

export function getDetail(id, callback){
  let logger = logging.Logger(className, get.name, config.log_level);
  let url = groupMgmtConfig.base + groupMgmtConfig.group + '/' + id;

  logger.INFO("Calling api with url: " + url);

  axios.get(url)
    .then(function (response) {
      logger.DEBUG("returning");
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response.data));

      let memberOf  = {};
      let groupMembers = {};
      if(response.data.data.group_members !== null && response.data.data.group_members !== undefined){
        groupMembers = loadMembersData(response.data.data.group_members, 0, {});
      }
      if(response.data.data.member_of !== null && response.data.data.member_of !== undefined){
        logger.INFO("loading group members");
        loadMembersData(response.data.data.member_of, function(err, memberOfResponse){
          memberOf = memberOfResponse;
          let groupData = {
            //groupMembers : groupMembers,
            memberOf : memberOf
          };
          logger.INFO(JSON.stringify(groupData));
          callback(null, groupData);
        });
      }


    })
    .catch(function (err) {
      logger.ERROR(err, formatter.exceptions.GET_REQUEST(groupMgmtConfig.base, err));

      callback(err);
    });
}

export function create(data, callback){
  let logger = logging.Logger(className, create.name, config.log_level);

  axios.post(groupMgmtConfig.base + groupMgmtConfig.group, data)
    .then(function (response) {
      logger.DEBUG(formatter.information.POST_REQUEST(groupMgmtConfig.base, data, response.data));

      callback(null, response);
    })
    .catch(function (err) {
      logger.ERROR(formatter.exceptions.POST_REQUEST(groupMgmtConfig.base, data, err));

      callback(err);
    });
}

export function removeMember(id, memberId){
  let logger = logging.Logger(className, get.name, config.log_level);

  axios.delete(groupMgmtConfig.base + groupMgmtConfig.group + id + groupMgmtConfig.member + "/" + memberId)
    .then(function (response) {
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response));

      callback(null, response);
    })
    .catch(function (err) {
      logger.ERROR(formatter.exceptions.GET_REQUEST(groupMgmtConfig.base, err));

      callback(err);
    });
}


function loadMembersData(members, callback){
  let logger = logging.Logger(className, loadMembersData.name, config.log_level);

  let numberCompleted = 0;
  let completed = {};

  for(let i = 0; i <  members.length; i++){
    let id = members[i]._id;
    let type = members[i].type;
    switch(type){
      case enums.groupManagementTypes.USER:
      {
        security.getUserData(id, function(err, userResponse){
          if(err){
            callback(err);
          }
          else{
            if(completed.Users === undefined){
              completed.Users = [];
            }
            completed.Users.push(userResponse);
            numberCompleted++;
            if(numberCompleted === members.length){
              callback(null, completed);
            }
          }

        })
      }
      case enums.groupManagementTypes.EVENT:
      {
        event.getEvent(id, function(err, eventResponse){
          if(err){
            callback(err);
          }
          else{
            if(completed.Events === undefined){
              completed.Events = [];
            }
            completed.Events.push(eventResponse);
            numberCompleted++;
            if(numberCompleted === members.length){
              callback(null, completed);
            }
          }

        })
      }
      case enums.groupManagementTypes.LOCATION:{
        Location.findById(id)
          .exec(function(err, locationResult){
            if(err){
              callback(err);
            }
            else{
              if(completed.Locations === undefined){
                completed.Locations = [];
              }
              completed.Locations.push(locationResult);
              numberCompleted++;
              if(numberCompleted === members.length){
                callback(null, completed);
              }
            }

          })
      }
      case enums.groupManagementTypes.SPACE:{
        logger.INFO("searching spaces with id : " + id);
        Space.findById(id)
          .exec(function(err, spaceResult){
            if(err){
              logger.ERROR(err, config.exceptions.COLLECTION_FAILED("space"));
              callback(err);
            }
            else{
              if(completed.Spaces === undefined){
                completed.Spaces = [];
              }

              completed.Spaces.push(spaceResult);
              numberCompleted++;
              logger.INFO("members : " + members.length + " number completed : " + numberCompleted );
              if(numberCompleted === members.length){
                callback(null, completed);
              }
            }

          })
      }
      case enums.groupManagementTypes.ACTIVITY:{
        Activity.findById(id)
          .exec(function(err, activityResult){
            if(err){
              callback(err);
            }
            else{
              if(completed.Activity === undefined){
                completed.Activity = [];
              }
              completed.Activity.push(activityResult);
              numberCompleted++;
              if(numberCompleted === members.length){
                callback(null, completed);
              }
            }

          })
      }
    }
  }
}

