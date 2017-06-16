commandCenterApp.controller('panel-controller', function($mdSidenav, $timeout, $scope, commandCenterService){
    $scope.isLoading = false;

    var changeTitle = function(title){
        $scope.title = title;
    };
    var changeLoader = function(isLoading){
        $scope.isLoading = isLoading;
    };

    commandCenterService.setTitleObserver(changeTitle);
    commandCenterService.setLoadObserver(changeLoader);

    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }
    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {

                });
        }, 200);
    }
    $scope.navBarToggle = buildDelayedToggler('left');
});