commandCenterApp.controller('location-controller', function($scope, $stateParams, $state, commandCenterService, locationService, imageService){
    commandCenterService.setLoader(true);
    locationService.list(
        function(res){
            $scope.locations = res;
            commandCenterService.setLoader(false);
        }
    );
    if($state.current.name === 'location.list')
    {
        commandCenterService.setTitle('Manage Location');
    }
    else if($state.current.name === 'location.edit')
    {
        commandCenterService.setTitle('Edit Location');
        commandCenterService.setLoader(true);
        locationService.get($stateParams.id,
            function(res){
                $scope.location = res;
                commandCenterService.setLoader(false);
            }
        );
    }
    else
    {
        commandCenterService.setTitle('Create Location');
    }

    //methods

    $scope.createAvatar = function(){
        imageService.avatarGenerator(function(image){
            $scope.location.hasImage = true;
            imageService.resizeImage(image)
                .then(function(res){
                    delete $scope.image;
                    $scope.image = res;
                })
        })
    };

    $scope.create = function(location){
        commandCenterService.setLoader(true);
        try {
            locationService.create(location, function(id){
                if(!!$scope.image)
                {
                    var imageReq = $scope.image;
                    imageReq.imageId = 1;
                    imageReq.id = location._id;

                    imageService.create(imageReq);
                }
            });
        }
        finally{
            commandCenterService.setLoader(false);
            $state.go('location.list')
        }
    };

    $scope.update = function(location){
        commandCenterService.setLoader(true);
        try{
            locationService.update(location, location._id,
                function () {
                    if(!!$scope.image)
                    {
                        var imageReq = $scope.image;
                        imageReq.imageId = 1;
                        imageReq.id = location._id;

                        imageService.create(imageReq);
                    }
                });
        }
        finally{
            commandCenterService.setLoader(false);
            $state.go('location.list')
        }
    };

    $scope.delete = function(id, index){
        locationService.delete(id);
    };
});