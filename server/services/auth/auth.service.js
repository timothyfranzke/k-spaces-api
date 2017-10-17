let expressJwt  = require('express-jwt');
let compose     = require('composable-middleware');
let logging     = require('../logging/logging.service');
let config      = require('../../config/configuration');
let className   = "auth.service";

export function isAuthenticated(){
    let methodName   = "isAuthenticated";


    return compose()
    // Validate jwt
        .use(function(req, res, next) {
            var applicationfound = false;
            if(req.query.ApplicationID === undefined){
              return res.sendStatus(403);
            }

            logging.INFO(className, methodName, "ApplicationID: " + req.query.ApplicationID);
            config.secrets.forEach(function(secret){

              if(secret.id === req.query.ApplicationID){
                applicationfound = true;
                let validateJwt   = expressJwt({
                  secret: secret.secret
                });
                logging.INFO(className, methodName, secret);
                if(validateJwt === undefined){
                  return res.sendStatus(403);
                }

                if(req.headers.authorization === undefined){
                  return res.sendStatus(403);
                }
                // allow access_token to be passed through query parameter as well
                if(req.query && req.query.hasOwnProperty('access_token')) {
                  logging.INFO(className, methodName, "Token : " + req.query.access_token);
                  req.headers.authorization = `Bearer ${req.query.access_token}`;
                }
                // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
                if(req.query && typeof req.headers.authorization === 'undefined' && typeof req.cookies.token !== 'undefined') {
                  logging.INFO(className, methodName, "Token : " + req.cookies.token);
                  req.headers.authorization = `Bearer ${req.cookies.token}`;
                }
                validateJwt(req, res, next);
              }
            });
        });
};

export function hasRole (roleRequired) {
    let methodName   = "hasRole";
    logging.INFO(className, methodName);

    let roles = ['sys-admin', 'admin', 'faculty', 'user', 'viewer'];
    if(!roleRequired) {
        throw new Error('Required role needs to be set');
    }
    return compose()
      .use(isAuthenticated())
      .use(function meetsRequirements(req, res, next) {
        let isAuthenticated = false;
        req.user.applications.forEach(function(userApplication){
          logging.INFO(className, methodName, "looping user.applications" + userApplication.application_id);
          if(userApplication.application_id === req.query.ApplicationID){

            userApplication.roles.forEach(function(userRole){
              logging.INFO(className, methodName, "looping userApplication.roles" + userRole);
              if(!isAuthenticated && roles.indexOf(userRole) >= roles.indexOf(roleRequired))
              {
                isAuthenticated = true;
                return next();

              }
            });
          }
        });

        logging.INFO(className,methodName,"isAuthenticated : " + isAuthenticated);
        if(!isAuthenticated)
        {
          logging(className, methodName, "sending status 403");
          res.sendStatus(403);
        }

    });
};
