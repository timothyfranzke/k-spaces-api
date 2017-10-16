let expressJwt  = require('express-jwt');
let compose     = require('composable-middleware');
let logging     = require('../../logging/logging.service');
let className   = "auth.service";

export function isAuthenticated(){
    let methodName   = "isAuthenticated";
    let validateJwt   = expressJwt({
        secret: 'itshardtostopatrain'
    });
    let db = require('../../../services/db/db.service').getDb();

    return compose()
    // Validate jwt
        .use(function(req, res, next) {

            if(req.headers.authorization === undefined){
                res.sendStatus(403);
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
          if(userApplication.application_id === '59e0c23a734d1d1c37fbb760'){
            userApplication.roles.forEach(function(userRole){
              if(!isAuthenticated && roles.indexOf(userRole) >= roles.indexOf(roleRequired))
              {
                isAuthenticated = true;
              }
            });
            if(isAuthenticated) {
              return next();
            } else {
              return res.status(403).send('Forbidden');
            }
          }
        });
    });
};
