commandCenterApp.controller('user-controller', function($scope, $stateParams, $state, commandCenterService, userService, imageService){
    userService.list(
        function(res) {
            $scope.users = res;
        }
    );

    if($state.current.name === 'user.list')
    {
        commandCenterService.setTitle('Manage User');
    }
    else if($state.current.name === 'user.edit')
    {
        commandCenterService.setLoader(true);
        userService.get($stateParams.id,
            function(res){
                commandCenterService.setTitle("Edit " + res.legal_name.first + "'s Profile");
                $scope.user = res;
                commandCenterService.setLoader(false);
            }
        );
    }
    else
    {
        commandCenterService.setTitle('Create User');
        $scope.user = {};
    }

    $scope.createAvatar = function(){
        imageService.avatarGenerator(function(image){
            $scope.user.hasImage = true;
            imageService.resizeImage(image)
                .then(function(res){
                    $scope.image = res;
                })
        })
    };

    //methods
    $scope.create = function(user){
        commandCenterService.setLoader(true);
        try {
            userService.create(user, function(id){
                var imageReq = $scope.image;
                imageReq.imageId = 1;
                imageReq.id = id;

                imageService.create(imageReq)
            });
        }
        finally{
            commandCenterService.setLoader(false);
            $state.go('user.list')
        }
    };

    $scope.update = function(user){
        commandCenterService.setLoader(true);
        try{
            userService.update(user, user._id,
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
            $state.go('user.list')
        }
    };

    $scope.delete = function(id){
        userService.delete(id);
    };

    //search
    $scope.search = function(term){
        commandCenterService.search('user', term)
            .then(function(res){
                $scope.items = res.data;
            })
    };
    $scope.selectItem = function(item){
        $scope.user.spouse = item._id;
        $scope.selectedItem = item;
    };
    $scope.addSpace = function(){

    }

});