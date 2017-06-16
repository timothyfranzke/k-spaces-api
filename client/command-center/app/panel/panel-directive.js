commandCenterApp.directive('panel', function() {
    return {
        restrict: 'E',
        controller: 'panel-controller',
        templateUrl: 'app/panel/panel.html'
    };
});