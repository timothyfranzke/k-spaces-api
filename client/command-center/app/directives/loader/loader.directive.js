commandCenterApp.directive('myDir', function () {
    return {
        restrict: 'E',
        scope: {
            myindex: '='
        },
        templateUrl:'app/directives/loader/loader.html',
        link: function(scope, element, attrs){

        }
    };
})