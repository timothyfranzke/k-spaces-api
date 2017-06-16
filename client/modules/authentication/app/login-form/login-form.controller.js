baseServiceApp.controller('login-form-controller', function($scope, loginFormService){
    $scope.user = {};
    $scope.login = loginFormService.login;
});