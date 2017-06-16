commandCenterApp.directive('avatarGenerator', function() {
    return {
        restrict: 'E',
        scope: {
            callback: '=callback'
        },
        controller:'avatarGeneratorControlller',
        templateUrl: 'app/directives/avatar-generator/avatar-generator.html'
    }
});