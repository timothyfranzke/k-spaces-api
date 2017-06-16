commandCenterApp.controller('spaces-controller', function($scope, $stateParams, $state, $mdDialog, commandCenterService, locationService, spacesService, spacesModel){
    $scope.selectedUsers = [];
    $scope.selectedFaculty = [];
    $scope.locations = [];
    $scope.space = {};
    $scope.space.faculty = [];
    $scope.space.students = [];

    locationService.list(
        function(res) {
            $scope.locations = res;
        }
    );

    commandCenterService.setLoader(true);
    spacesService.list(
        function(res){
            $scope.spaces = res;
            commandCenterService.setLoader(false);
        }
    );
    if($state.current.name === 'spaces.list')
    {
        commandCenterService.setTitle('Manage Space');
    }
    else if($state.current.name === 'spaces.edit')
    {
        commandCenterService.setTitle('Edit Space');
        commandCenterService.setLoader(true);
        spacesService.get($stateParams.id,
            function(res){
                $scope.space = res;
                commandCenterService.setLoader(false);
            }
        );
    }
    else
    {
        commandCenterService.setTitle('Create Space');
    }

    $scope.selectFaculty = function(){
        $mdDialog
            .show({
                controller:'search-user-controller',
                templateUrl: 'app/dialogs/search-user/search-user.html',
                clickOutsideToClose: true,
                fullscreen : true
            })
            .then(
                function(users){
                    $scope.space.faculty = $scope.space.faculty.concat(users);
                });
    };

    $scope.selectStudent = function(){
        $mdDialog
            .show({
                controller:'search-user-controller',
                templateUrl: 'app/dialogs/search-user/search-user.html',
                clickOutsideToClose: true,
                fullscreen : true
            })
            .then(
                function(users){
                    $scope.space.students = $scope.space.students.concat(users);
                    console.log($scope);
                });
    };
    $scope.deleteFaculty = function(id, index){
        $scope.space.faculty.splice(index, 1);
    };
    $scope.deleteStudent = function(id, index){
        $scope.space.students.splice(index, 1);
    };
    $scope.deleteLocation = function(){
        $scope.space.location = {};
    };

    $scope.$watch('selectedLocation', function(location){
       if(location !== undefined)
       {
           $scope.selectedLocation = undefined;
           $scope.space.location = {
               "name":location.name,
               "_id" : location._id
           }
       }
    });

    $scope.createAvatar = function(){
        imageService.avatarGenerator(function(image){
            $scope.user.hasImage = true;
            imageService.resizeImage(image)
                .then(function(res){
                    $scope.image = res;
                })
        })
    };

    //CRUD
    $scope.create = function(space){
        commandCenterService.setLoader(true);
        try {
            spacesService.create(space,
                function(id){
                    var imageReq = $scope.image;
                    imageReq.imageId = 1;
                    imageReq.id = id;

                    imageService.create(imageReq)
                },
                function(err) {console.log(err)});
        }
        finally{
            commandCenterService.setLoader(false);
            $state.go('spaces.list')
        }
    };
    $scope.update = function(space){
        commandCenterService.setLoader(true);
        try{
            spacesService.update(space, space._id,
                function () {
                    if(!!$scope.image)
                    {
                        var imageReq = $scope.image;
                        imageReq.imageId = 1;
                        imageReq.id = user._id;

                        imageService.create(imageReq);
                    }
                });
        }
        finally{
            commandCenterService.setLoader(false);
            $state.go('spaces.list')
        }


    };
    $scope.delete = function(id){
        spacesService.delete(id);
    };
});
//8007226602