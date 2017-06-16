commandCenterApp.factory('locationModel', function(){
    var location = {
        location:'',
        hours:{
            open:'',
            close:''
        },
        days_of_week:{
            sunday:false,
            monday:false,
            tuesday:false,
            wednesday:false,
            thursday:false,
            friday:false,
            saturday:false
        }
    };
    var locations = [];
    return {
        location: location,
        locations : locations
    };
});