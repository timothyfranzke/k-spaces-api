authApp.factory('loginFormService', function($http, $q, config, baseService){
    var url = config.url;
    var jwt = '';
    var isAuthenticated = false;
    var callbacks = [];
    var defer = $q.defer();

   return {
       observeJwt: function(callback){
           callbacks.push(callback);
       },
       setJwt: function(value){
           jwt = value;
           callbacks.forEach(function(callback){
               callback(jwt);
           });
       },
       getJwt: function(){
           return jwt;
       },
       login: function(loginData){
           baseService.POST(url, loginData)
               .then(function(res){
                   this.setJwt(res);
                   defer.resolve(jwt);
               })
               .catch(function(err){
                   defer.reject(err);
               });
            return defer.promise;
       }
   }
});