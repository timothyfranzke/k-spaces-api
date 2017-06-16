commandCenterApp.controller('search-user-controller', function($scope, $mdDialog, commandCenterService){
    $scope.selectedUsers = [];
    $scope.search = function(term){
        commandCenterService.search('user', term)
            .then(function(res){
                $scope.items = res.data;
            })
    };
    $scope.selectItem = function(item){
        if(item !== undefined)
            $scope.selectedUsers.push(item);
    };
    $scope.unselectItem = function(index){
        $scope.selectedUsers.splice(index, 1);
    };
    $scope.select = function(users){
        $mdDialog.hide(users);
    };
    $scope.cancel = function(){
        $mdDialog.cancel();
    };
});