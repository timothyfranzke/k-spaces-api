loginApp.config(function($urlRouterProvider, $stateProvider, $locationProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/login/login.html',
            controller: 'login-controller'
        });
    $urlRouterProvider.otherwise('/');
});