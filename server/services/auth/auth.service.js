let expressJwt  = require('express-jwt');
let compose     = require('composable-middleware');


export function isAuthenticated(){
    let validateJwt = expressJwt({
        secret: 'tasmanianDevil'
    });
    return compose()
    // Validate jwt
        .use(function(req, res, next) {
            if(req.headers.authorization === undefined){
                res.sendStatus(403);
            }
            // allow access_token to be passed through query parameter as well
            if(req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = `Bearer ${req.query.access_token}`;
            }
            // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
            if(req.query && typeof req.headers.authorization === 'undefined') {
                req.headers.authorization = `Bearer ${req.cookies.token}`;
            }
            validateJwt(req, res, next);
        });
};

export function hasRole (roleRequired) {

    let roles = ['sys-admin', 'admin', 'faculty', 'user', 'viewer'];
    if(!roleRequired) {
        throw new Error('Required role needs to be set');
    }
    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            console.log("authenticating");
            let isAuthenticated = false;
            req.user.roles.forEach(function(role){
                if(!isAuthenticated && roles.indexOf(role) >= roles.indexOf(roleRequired))
                {
                    isAuthenticated = true;
                }
            });
            if(isAuthenticated) {
                return next();
            } else {
                return res.status(403).send('Forbidden');
            }
        });
};