authApp.factory('authenticationService', function($http, $q, baseService){
    var defer = $q.defer();
    return {
        login: function(loginData, url){
            baseService.POST(url, loginData)
                .then(function(res){
                    if(res.status !== 200)
                    {
                        defer.reject();
                    }
                    else{
                        jwt = res.data.token;
                        localStorage.setItem('token', jwt);
                        localStorage.setItem('redirect', res.data.redirect);
                        window.location = res.data.redirect;
                        defer.resolve(res.data);
                    }

                })
                .catch(function(err){
                    defer.reject(err);
                });
            return defer.promise;
        },
        register: function(registerData, url){
            baseService.POST(url, registerData)
                .then(function(res){
                    defer.resolve(res.data);
                })
                .catch(function(err){
                    defer.reject(err);
                });
            return defer.promise;
        }
    }
});