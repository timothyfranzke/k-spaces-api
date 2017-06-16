commandCenterApp.config(function($urlRouterProvider, $stateProvider, $locationProvider) {
    $stateProvider
        .state('home',{
            url:'/',
            templateUrl:'app/navigation/navigation.html',
            controller:'navigation-controller'
        })
        .state('manage', {
           url:'/manage',
            templateUrl:'app/panel/manage/manage.html',
            controller:'manage-controller'
        })
        .state('user', {
            abstract:true,
            templateUrl:'app/panel/manage/user/user.html'
        })
        .state('user.list', {
            url:'/manage/user',
            templateUrl:'app/panel/manage/user/user-list.html',
            controller:'user-controller'
        })
        .state('user.edit', {
            url: '/manage/:id/user',
            templateUrl:'app/panel/manage/user/user-modify.html',
            controller:'user-controller'
        })
        .state('user.create', {
            url: '/manage/user/create',
            templateUrl:'app/panel/manage/user/user-modify.html',
            controller:'user-controller'
        })
        .state('location', {
            abstract:true,
            templateUrl:'app/panel/manage/location/location.html',
        })
        .state('location.list', {
            url:'/manage/location',
            templateUrl:'app/panel/manage/location/location-list.html',
            controller:'location-controller'
        })
        .state('location.edit', {
            url: '/manage/:id/location',
            templateUrl:'app/panel/manage/location/location-modify.html',
            controller:'location-controller'
        })
        .state('location.create', {
            url: '/manage/location/create',
            templateUrl:'app/panel/manage/location/location-modify.html',
            controller:'location-controller'
        })
        .state('spaces', {
            abstract:true,
            templateUrl:'app/panel/manage/spaces/spaces.html',
        })
        .state('spaces.list', {
            url:'/manage/spaces',
            templateUrl:'app/panel/manage/spaces/spaces-list.html',
            controller:'spaces-controller'
        })
        .state('spaces.edit', {
            url: '/manage/:id/spaces',
            templateUrl:'app/panel/manage/spaces/spaces-modify.html',
            controller:'spaces-controller'
        })
        .state('spaces.create', {
            url: '/manage/spaces/create',
            templateUrl:'app/panel/manage/spaces/spaces-modify.html',
            controller:'spaces-controller'
        })
        .state('event', {
            abstract:true,
            templateUrl:'app/panel/manage/event/event.html',
        })
        .state('event.list', {
            url:'/manage/event',
            templateUrl:'app/panel/manage/event/event-list.html',
            controller:'event-controller'
        })
        .state('event.edit', {
            url: '/manage/:id/event',
            templateUrl:'app/panel/manage/event/event-modify.html',
            controller:'event-controller'
        })
        .state('event.create', {
            url: '/manage/event/create',
            templateUrl:'app/panel/manage/event/event-modify.html',
            controller:'event-controller'
        })
        .state('messages', {
            url: '/message',
            templateUrl:'app/panel/message/message.html',
            controller:'message-controller'
        })
        .state('message-orig', {
            url: '/messageOG',
            templateUrl: 'app/panel/message/message-orig.html'
        });
    $urlRouterProvider.otherwise('/manage');
    //$locationProvider.html5Mode(true);
});