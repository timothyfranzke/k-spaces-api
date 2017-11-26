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
let UserDetail        = require('../../models/userDetail');
let Location          = require('../../models/location');
let Space             = require('../../models/space');
let Activity          = require('../../models/activity');
let Note              = require('../../models/note');
let Request           = require('../../models/request');

//constants
const className = 'group_mgmt.service';

export function getIds(id, callback){
  let logger = logging.Logger(className, getDetail.name, config.log_level);
  let url = groupMgmtConfig.base + groupMgmtConfig.group + '/' + id;

  logger.INFO("Calling api with url: " + url);

  axios.get(url)
    .then(function (response) {
      logger.DEBUG("returning");
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response.data));

      callback(null, response.data.data);
    })
    .catch(function (err){
      logger.ERROR(err, formatter.exceptions.GET_REQUEST(groupMgmtConfig.base, err));

      callback(err);
    });
}

export function getFilteredIds(id, filter, callback){
  let logger = logging.Logger(className, getDetail.name, config.log_level);
  let url = groupMgmtConfig.base + groupMgmtConfig.group + '/' + id;

  logger.INFO("Calling api with url: " + url);

  axios.get(url)
    .then(function (response) {
      logger.DEBUG("returning");
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response.data));

      let groupMembers=[]
      response.data.data.group.forEach(function(group){
        if(group.type === filter){
          groupMembers.push(group)
        }
      });

      let groupData = {
        group : groupMembers
      };

      callback(null, groupData);
    })
    .catch(function (err){
      logger.ERROR(err, formatter.exceptions.GET_REQUEST(groupMgmtConfig.base, err));

      callback(err);
    });
}

export function getDetail(id, callback){
  let logger = logging.Logger(className, getDetail.name, config.log_level);
  let url = groupMgmtConfig.base + groupMgmtConfig.group + '/' + id;

  logger.INFO("Calling api with url: " + url);

  axios.get(url)
    .then(function (response) {
      logger.DEBUG("returning");
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response.data));

      let memberOf  = {};
      let groupMembers = {};
      if(response.data.data.group !== null && response.data.data.group !== undefined){
        loadMembersData(response.data.data.group, config.enumerations.filterTypes.ALL, function(err, groupMembersResponse){
          groupMembers = groupMembersResponse;
          logger.DEBUG(JSON.stringify(groupMembersResponse));

          let groupData = {
            group : groupMembers
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

export function getFilteredDetail(id, filter, callback){
  let logger = logging.Logger(className, getDetail.name, config.log_level);
  let url = groupMgmtConfig.base + groupMgmtConfig.group + '/' + id;

  logger.INFO("Calling api with url: " + url);

  axios.get(url)
    .then(function (response) {
      logger.DEBUG("returning");
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response.data));

      let memberOf  = {};
      let groupMembers = {};
      if(response.data.data.group !== null && response.data.data.group !== undefined){
        loadMembersData(response.data.data.group, filter, function(err, groupMembersResponse){
          groupMembers = groupMembersResponse;
          logger.DEBUG(JSON.stringify(groupMembersResponse));

          let groupData = {
            group : groupMembers
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

export function removeMember(id, memberId, callback){
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

export function removeMemberBulk(id, memberIds, callback){
  let logger = logging.Logger(className, get.name, config.log_level);
  let numberProcessed = 0;

  memberIds.forEach(function(memberId){
    axios.delete(groupMgmtConfig.base + groupMgmtConfig.group + id + groupMgmtConfig.member + "/" + memberId)
      .then(function (response) {
        logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response));

        numberProcessed++;
        if(numberProcessed === memberIds.length){
          callback();
        }
      })
      .catch(function (err) {
        logger.ERROR(formatter.exceptions.GET_REQUEST(groupMgmtConfig.base, err));

        numberProcessed++;
        if(numberProcessed === memberIds.length){
          callback();
        }
      });
  })
}

function loadMembersData(members, filter, callback){
  let logger = logging.Logger(className, loadMembersData.name, config.log_level);

  let numberCompleted = 0;
  let completed = {};
  logger.DEBUG('filtering : ' + filter);
  for(let i = 0; i <  members.length; i++){
    let id = members[i]._id;
    let type = members[i].type;
    if (type === config.enumerations.groupManagementTypes.PARENT || type === config.enumerations.groupManagementTypes.STUDENT ||  type === config.enumerations.groupManagementTypes.FACULTY){
      type = config.enumerations.groupManagementTypes.USER;
    }
    if(filter === config.enumerations.filterTypes.ALL || filter === type)
    {
      switch(type){
        case enums.groupManagementTypes.USER:
        {
          logger.DEBUG('searching users : ' + id);
          UserDetail.findById(id)
            .exec(function(err, userDetailResult){
              if(err){
                callback(err);
              }
              else{
                if(completed.users === undefined){
                  completed.users = [];
                }
                completed.users.push(userDetailResult);
                logger.DEBUG("found user : " + JSON.stringify(completed));
                numberCompleted++;
                if(numberCompleted === members.length){
                  callback(null, completed);
                }
              }

            });
          break;
        }
        case enums.groupManagementTypes.EVENT:
        {
          logger.DEBUG('reached this piece : ' + JSON.stringify(members[i]));
          event.getEvent(id, function(err, eventResponse){
            if(err){
              callback(err);
            }
            else{
              if(completed.events === undefined){
                completed.events = [];
              }
              completed.events.push(eventResponse);
              numberCompleted++;
              if(numberCompleted === members.length){
                callback(null, completed);
              }
            }

          });
          break;
        }
        case enums.groupManagementTypes.LOCATION:{
          Location.findById(id)
            .exec(function(err, locationResult){
              if(err){
                callback(err);
              }
              else{
                if(completed.locations === undefined){
                  completed.locations = [];
                }
                completed.locations.push(locationResult);
                numberCompleted++;
                if(numberCompleted === members.length){
                  callback(null, completed);
                }
              }

            });
          break;
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
                if(completed.spaces === undefined){
                  completed.spaces = [];
                }

                completed.spaces.push(spaceResult);
                numberCompleted++;
                logger.INFO("members : " + members.length + " number completed : " + numberCompleted );
                if(numberCompleted === members.length){
                  callback(null, completed);
                }
              }

            });
          break;
        }
        case enums.groupManagementTypes.ACTIVITY:{
          Activity.findById(id)
            .exec(function(err, activityResult){
              if(err){
                callback(err);
              }
              else{
                if(completed.activities === undefined){
                  completed.activities = [];
                }
                completed.activities.push(activityResult);
                numberCompleted++;
                if(numberCompleted === members.length){
                  callback(null, completed);
                }
              }

            });
          break;
        }
        case enums.groupManagementTypes.NOTE:{
          logger.DEBUG("searching notes");
          Note.findById(id)
            .exec(function(err, noteResult){
              if(err){
                callback(err);
              }
              else{
                if(completed.notes === undefined){
                  completed.notes = [];
                }
                completed.notes.push(noteResult);
                numberCompleted++;
                if(numberCompleted === members.length){
                  callback(null, completed);
                }
              }

            });
          break;
        }
        case enums.groupManagementTypes.REQUEST:{
          logger.INFO("searching requests with id : " + id);
          Request.findById(id)
            .exec(function(err, requestResult){
              if(err){
                logger.ERROR(err, config.exceptions.COLLECTION_FAILED("request"));
                callback(err);
              }
              else{
                if(completed.requests === undefined){
                  completed.requests = [];
                }

                completed.requests.push(requestResult);
                numberCompleted++;
                logger.INFO("members : " + members.length + " number completed : " + numberCompleted );
                if(numberCompleted === members.length){
                  callback(null, completed);
                }
              }

            });
          break;
        }
      }
    }
    else{
      numberCompleted++;
    }
  }
}

export function isIdAMember(id, memberId, callback){
  let logger = logging.Logger(className, getDetail.name, config.log_level);
  let url = groupMgmtConfig.base + groupMgmtConfig.group + '/' + id;
  let isMember = false;

  logger.INFO("Calling api with url: " + url);

  axios.get(url)
    .then(function (response) {
      logger.DEBUG("member id : " + memberId);
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response.data));
      if(response.data.data !== undefined && response.data.data.group != undefined){
        response.data.data.group.forEach(function(group){
          if(group._id === memberId){
            isMember = true;
          }
        });
      }
      callback(isMember);
    })
    .catch(function(err){
      callback(isMember);
    })

}
