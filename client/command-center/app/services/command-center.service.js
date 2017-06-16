commandCenterApp.factory('commandCenterService', function(baseService, $mdToast, $mdDialog) {
    var title = '';
    var loader = false;
    var titleObservers = [];
    var loadObservers = [];

    return {
        setTitle: function(name){
            title = name;
            titleObservers.forEach(function(callback){
                callback(title);
            });
        },
        setTitleObserver: function(callback){
            titleObservers.push(callback);
        },
        setLoader: function(isLoading){
            loader = isLoading;
            loadObservers.forEach(function(callback){
                callback(loader);
            });
        },
        setLoadObserver: function(callback){
            loadObservers.push(callback);
        },
        setToast: function(message, type){
            var highlight = 'md-accent';
            if(type === TOAST_TYPES.ERROR)
            {
                highlight = 'md-warn';
                message = 'ERROR: ' + message;
            }
            var toast = $mdToast.simple()
                .textContent(message)
                .highlightClass(highlight)
                .position("top right");
            $mdToast.show(toast)
        },
        confirmDialog: function(yes){
            $mdDialog.show({
                controller:'confirmController',
                templateUrl: 'app/dialogs/confirm.html',
                clickOutsideToClose: true,
                fullscreen : false
            }).then(yes);
        },

        getTitle: function(){
            return title;
        },
        getEntity: function(){

        },
        createEntity: function(){

        },
        createUser: function(user){
            return baseService.POST(USER, user);
        },
        getUser: function(id){
            return baseService.GET(USER, id);
        },
        updateUser: function(data, id){
            return baseService.PUT(USER, data, id);
        },
        search:function(state, term){
            return baseService.GET(SEARCH, term);
        }
    }
});