commandCenterApp.controller('message-controller', function($scope, commandCenterService, messageService){
    commandCenterService.setTitle('Message Center');
    messageService.list(
        function(res) {
            $scope.messages = res;
            $scope.selectedMessage = res[0];
        }
    );

    $scope.compose = function(){
        messageService.messageDialog(function(result){
            commandCenterService.setLoader(true);
            messageService.create(result, function(){
                commandCenterService.setLoader(false);
            });
        });
    };

    $scope.selectMessage = function(message){
        $scope.selectedMessage = message;
    };
});