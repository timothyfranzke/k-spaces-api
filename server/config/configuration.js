module.exports = {
  'database': 'mongodb://spaces-app:TimDaveAndSteve@ds145370.mlab.com:45370/spaces',
  'applicaitonId':'593e0abbf36d2806fcd56c8b',
  'securitySecret':'12253d7-7314-4838-b1b2-d9fa5c115968',
  'secrets' : [
    {'id':'593e0abbf36d2806fcd56c8b','secret':'tasmanianDevil'},
    {'id':'596542b4f36d2836aab1a45d','secret':'bugsBunny'},
    {'id':'59e0c23a734d1d1c37fbb760','secret':'itshardtostopatrain'},
    {'id':'59e178a8734d1d1c37fc3c52','secret':'peterpan'},
    {'id':'59f23f65f36d2855693144f5','secret':'scaryStories'},
    {'id':'5a01c8a0734d1d2e7b02678f','secret':'tasmanianDevil'},
    {'id':'5a01c920734d1d2e7b026841','secret':'itshardtostopatrain'}
  ],
  'userRoles' : {
    'FACULTY':'faculty',
    'STUDENT':'user',
    'PARENT':'parent',
    'ADMIN':'admin'
  },
  'enumerations':{
    'groupManagementTypes':{
      'ENTITY':'entity',
      'FACULTY':'faculty',
      'STUDENT':'student',
      'PARENT':'parent',
      'ADMIN':'admin',
      'EVENT':'event',
      'SPACE':'space',
      'LOCATION':'location',
      'PHOTO':'photo',
      'VIDEO':'video',
      'USER':'user',
      'ACTIVITY':'activity',
      'NOTE':'note',
      'REQUEST':'request'
    },
    'filterTypes':{
      'ALL':'all',
      'NONE':'none'
    },
    'entityTypes':{
      'DAYCARE':'daycare',
      'VENDOR':'vendor'
    }
  },
  'http_responses':{
    'information':{
      'CREATE_SUCCESS': function(collectionName){return collectionName + " created successfully"},
      'UPDATE_SUCCESS': function(collectionName){return collectionName + " updated successfully"},
      'REMOVE_SUCCESS': function(collectionName){return collectionName + " removed successfully"}
    },
    'exceptions':{
      'UPDATE_ERROR': function(collectionName){return "Error occurred while updating" + collectionName},
      'CREATE_ERROR':function(collectionName){return "Error occurred while updating" + collectionName},
      'GET_ERROR':function(collectionName){return "Error occurred while retrieving" + collectionName}
    }
  },
  'exceptions':{
    'COLLECTION_FAILED' : function(collectionName){return "Collection : " + collectionName + ", Status : failed"},
    'COLLECTION_RETURNED_NULL' : function(collectionName) {return "Collection : " + collectionName + ", Status : failed,  Result : null or undefined"}
  },
  'information':{
    'COLLECTION_INSERT' : function(collectionName, insertData) { return "Collection : " + collectionName + ", InsertData : " + JSON.stringify(insertData)},
    'COLLECTION_QUERY': function(collectionName, query) { return "Collection : " + collectionName + ", Query : " + JSON.stringify(query)},
    'COLLECTION_UPDATE': function(collectionName, id, updateData) { return "Collection : " + collectionName + " id : " + id + ", UpdateData : " + JSON.stringify(updateData)},
    'COLLECTION_SUCCEEDED_WITH_RESULT': function(collectionName, result){return "Collection :" + collectionName + ", Status : succeeded,  Result : " + JSON.stringify(result)}
  },
  'log_formatter':{
    'api':{
      'exceptions':{
        'GET_REQUEST':function(apiName, error){return "Method : GET, API : " + apiName + ", Error : " + error},
        'POST_REQUEST':function(apiName, postData, error){return "Method : POST, API : " + apiName + ", PostData : "+ JSON.stringify(postData) +", Error : " + error},
        'DELETE_REQUEST':function(apiName, error){return "Method : DELETE, API : " + apiName + ", Error : " + error}
      },
      'information':{
        'GET_REQUEST':function(apiName, responseData) { return "Method : GET, API  : " + apiName + ", ResponseData : " + JSON.stringify(responseData)},
        'POST_REQUEST':function(apiName, postData, responseData) { return "Method : POST, API  : " + apiName + ", PostData : "+ JSON.stringify(postData) +", ResponseData : " + JSON.stringify(responseData)},
        'DELETE_REQUEST':function(apiName, responseData) { return "Method : DELETE, API  : " + apiName + ", ResponseData : " + JSON.stringify(responseData)}
      }
    },
    'db':{
      'exceptions':{
        'COLLECTION_FAILED' : function(collectionName){return "Collection : " + collectionName + ", Status : failed"},
        'COLLECTION_RETURNED_NULL' : function(collectionName) {return "Collection : " + collectionName + ", Status : failed,  Result : null or undefined"}
      },
      'information':{
        'COLLECTION_INSERT' : function(collectionName, insertData) { return "Collection : " + collectionName + ", InsertData : " + JSON.stringify(insertData)},
        'COLLECTION_QUERY': function(collectionName, query) { return "Collection : " + collectionName + ", Query : " + JSON.stringify(query)},
        'COLLECTION_UPDATE': function(collectionName, id, updateData) { return "Collection : " + collectionName + " id : " + id + ", UpdateData : " + JSON.stringify(updateData)},
        'COLLECTION_SUCCEEDED_WITH_RESULT': function(collectionName, result){return "Collection :" + collectionName + ", Status : succeeded,  Result : " + JSON.stringify(result)}
      }
    }
  },
  'log_level':'DEBUG',
  'apis':{
    'group_mgmt': {
      base:'https://tech-spaces-group-mgmt-api.herokuapp.com',
      group: '/api/group',
      member: '/member'
    },
    'security':{
      //base:'https://tech-spaces-security-api.herokuapp.com/',
      base:'http://localhost:3009',
      register:'/api/register/'
    }
  }
  //'database'   : 'mongodb://localhost/techauthentication'
};
