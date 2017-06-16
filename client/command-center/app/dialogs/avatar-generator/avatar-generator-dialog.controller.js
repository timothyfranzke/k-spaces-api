commandCenterApp.controller('avatarGeneratorDialogController', function($scope, $mdDialog, commandCenterService){
    $scope.processImage = function(image){
        $scope.image = image;
    };
    $scope.select = function(){
        $mdDialog.hide($scope.image);
    };
    $scope.cancel = function(){
        $mdDialog.cancel();
    };
});