commandCenterApp.directive('site-header', function() {
    return {
        restrict: 'E',
        controller: 'header-controller',
        templateUrl: 'app/header/header.html'
    };
});