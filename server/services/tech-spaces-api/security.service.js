let axios     = require('axios');

//services
let logging   = require('../logging/logging.service');
let config             = require('../../config/configuration');

//constants
const CLASS_NAME = 'security.service';

export function getUserData(id, callback){
  let response = {};
  callback(null, response);
}

export function registerUser(data, callback){

    let logger = logging.Logger(CLASS_NAME, registerUser.name, config.log_level);

    axios.post(config.apis.security.base + config.apis.security.register + config.applicaitonId + "?appKey=" + config.applicaitonId + "&appSecret=" + config.securitySecret, data)
      .then(function (response) {
        logger.DEBUG(config.log_formatter.api.information.POST_REQUEST(config.apis.security.base + config.apis.security.register + config.applicaitonId, data, response.data));

        callback(null, response.data.id);
      })
      .catch(function (err) {
        logger.ERROR(config.log_formatter.api.exceptions.POST_REQUEST(config.apis.security.base + config.apis.security.register + config.applicaitonId, data, err));

        callback(err);
      });

}
