authApp.directive('login-form', function(){
    return {
        restrict: 'E',
        controller: 'login-form-controller',
        templateUrl:'app/login-form/login-form.html',
    };
});