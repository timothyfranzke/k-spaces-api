commandCenterApp.controller('message-compose-controller', function($scope, $mdDialog, commandCenterService){
    $scope.selectedUsers = [];
    $scope.search = function(term){
        commandCenterService.search('user', term)
            .then(function(res){
                console.log(res);
                $scope.items = res.data;
            })
    };

    $scope.send = function(message){
        console.log(message);
        $mdDialog.hide(message);
    };
    $scope.cancel = function(){
        $mdDialog.cancel();
    };
});