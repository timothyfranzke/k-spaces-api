loginApp.factory('loginService', function($http, $q, loginConfig, baseService){
    var url = "http://localhost:3004/login";
    var jwt = '';
    var isAuthenticated = false;
    var callbacks = [];
    var defer = $q.defer();

    return {
        observeJwt: function(callback){
            callbacks.push(callback);
        },
        setJwt: function(value){

        },
        getJwt: function(){
            return jwt;
        },
        login: function(loginData, err, result){
            baseService.POST(url, loginData)
                .then(function(res){
                    jwt = res.data.token;
                    localStorage.setItem('token', jwt)
                    callbacks.forEach(function(callback){
                        callback(jwt);
                    });
                    console.log(res.data.redirect);
                    window.location = res.data.redirect;
                    defer.resolve(jwt);
                })
                .catch(function(err){
                    defer.reject(err);
                });
            return defer.promise;
        }
    }
});