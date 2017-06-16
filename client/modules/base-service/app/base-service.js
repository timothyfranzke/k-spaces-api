baseServiceApp.factory('baseService', function($http, $q){
    var MakeRequest = function (request) {
        var defer = $q.defer();
        $http(request)
            .then(function (data) {
                defer.resolve(data);
            }, function(response){
                defer.reject(response);
            });
        return defer.promise;
    };
    return {
        LIST: function(url){
            var request = {
                url: window.location.origin + url,
                method: 'GET'
            };
            return MakeRequest(request);
        },
        GET: function(url, id){
            var request = {
                url: window.location.origin + url + '/' + id,
                method: 'GET'
            };
            return MakeRequest(request);
        },
        POST: function(url, bodyData){
            var request = {
                url: url,
                method: 'POST',
                data: bodyData
            };
            return MakeRequest(request);
        },
        PUT: function(url, bodyData, id){
            var request = {
                url: window.location.origin + url + '/' + id,
                method: 'PUT',
                data: bodyData
            };
            return MakeRequest(request);
        },
        DELETE: function(url, id){
            var request = {
                url: window.location.origin + url + '/' + id,
                method: 'DELETE'
            };
            return MakeRequest(request);
        }
    }
});