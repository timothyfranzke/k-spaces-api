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


//constants
const className = 'group_mgmt.service';

export function get(id){
  let logger = logging.Logger(className, get.name, config.log_level);

  axios.get(groupMgmtConfig.base + groupMgmtConfig.group + id)
    .then(function (response) {
      logger.DEBUG(formatter.information.GET_REQUEST(groupMgmtConfig.base, response));

      let completed = {};
      callback(null, loadMembersData(response, 0, completed));
    })
    .catch(function (err) {
      logger.ERROR(formatter.exceptions.GET_REQUEST(groupMgmtConfig.base, err));

      callback(err);
    });
}

export function create(data, callback){
  let logger = logging.Logger(className, create.name, config.log_level);

  axios.post(groupMgmtConfig.base + groupMgmtConfig.group, data)
    .then(function (response) {
      logger.DEBUG(formatter.information.POST_REQUEST(groupMgmtConfig.base, data, response));

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


function loadMembersData(members, index, completed){

  let id = members[index]._id;
  let type = members[index].type;
  switch(type){
    case enums.groupManagementTypes.USER:
    {
      security.getUserData(id, function(err, userResponse){
        if(err){

        }
        else{
          if(completed.Locations === undefined){
            completed.Locations = [];
          }
          if((members.length -1) > index){
            completed.Locations.push(locationResult);
            return loadMembersData(members, index ++, completed);
          }
          else {
            return completed;
          }
        }
      })
    }
    case enums.groupManagementTypes.EVENT:
    {
      event.getEvent(id, function(err, eventResponse){
        if(err){

        }
        else{
          if(completed.Events === undefined){
            completed.Events = [];
          }
          if((members.length -1) > index){
            completed.Events.push(eventResponse);
            return loadMembersData(members, index ++, completed);
          }
          else {
            return completed;
          }
        }
      })
    }
    case enums.groupManagementTypes.LOCATION:{
      Location.findById(id)
        .exec(function(err, locationResult){
          if(err){

          }
          else{
            if(completed.Locations === undefined){
              completed.Locations = [];
            }
            if((members.length -1) > index){
              completed.Locations.push(locationResult);
              return loadMembersData(members, index ++, completed);
            }
            else {
              return completed;
            }
          }
        })
    }
    case enums.groupManagementTypes.SPACE:{
      Space.findById(id)
        .exec(function(err, spaceResult){
          if(err){

          }
          else{
            if(completed.Spaces === undefined){
              completed.Spaces = [];
            }
            if((members.length -1) > index){
              completed.Spaces.push(spaceResult);
              return loadMembersData(members, index ++, completed);
            }
            else {
              return completed;
            }
          }
        })
    }

  }
}

