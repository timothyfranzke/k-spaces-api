loginApp.controller('login-controller', function($scope, loginConfig, loginService, authenticationService){
    $scope.loginError = false;
    $scope.user = {};
    $scope.login = function(user){
        authenticationService.login(user, loginConfig.url)
            .then(function(res){
                console.log(res);
            })
            .catch(function() {
                $scope.loginError =true;
            })
    };
});