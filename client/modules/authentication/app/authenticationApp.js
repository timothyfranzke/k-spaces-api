var authApp = angular.module('authentication-app', ['base-service']);
authApp.factory('httpRequestInterceptor', function () {
    return {
        request: function (config) {
            if(!!localStorage.getItem('token'))
                config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
            return config;
        },
        response: function(config){
            console.log(config.status);
            return config;
        },
        responseError : function(config){
            console.log(config);
            switch(config.status){
                case 401:
                case 403:
                    console.log("403");
                    localStorage.clear();
                    window.location = "http://localhost:3002/login";
                    break;

            }
            return config;
        }
    };
});

authApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});