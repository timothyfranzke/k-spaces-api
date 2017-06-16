commandCenterApp.controller('event-controller', function($scope, $stateParams, $state, $mdDialog, spacesService, eventService, commandCenterService){
    spacesService.list(
        function(res) {
            $scope.locations = res;
        }
    );
    commandCenterService.setLoader(true);
    eventService.list(
        function(res){
            $scope.events = res;
            commandCenterService.setLoader(false);
        }
    );
    if($state.current.name === 'event.list')
    {
        commandCenterService.setTitle('Manage Events');
    }
    else if($state.current.name === 'event.edit')
    {
        commandCenterService.setTitle('Edit Event');
        commandCenterService.setLoader(true);
        eventService.get($stateParams.id,
            function(res){
                $scope.event = res;
                commandCenterService.setLoader(false);
            }
        );
    }
    else
    {
        commandCenterService.setTitle('Create Event')
    }

    //methods
    $scope.create = function(event){
        commandCenterService.setLoader(true);
        try {
            eventService.create(event,
                function(res) {console.log(res)});
        }
        finally{
            commandCenterService.setLoader(false);
            $state.go('event.list')
        }
    };
    $scope.update = function(space){
        commandCenterService.setLoader(true);
        try{
            eventService.update(event, event._id,
                function () {
                    commandCenterService.setLoader(false);
                });
        }
        finally{
            $state.go('event.list')
        }
    };
    $scope.delete = function(id){
        eventService.delete(id);
    };
});