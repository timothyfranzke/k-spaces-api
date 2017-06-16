commandCenterApp.factory('eventModel', function(){
    var event = {
        name:'',
        vendor:'',
        description:'',
        date:{
            start_date:'',
            start_time:'',
            end_time:''
        },
        recur:{
            days_of_week:{
                sunday:false,
                monday:false,
                tuesday:false,
                wednesday:false,
                thursday:false,
                friday:false,
                saturday:false
            },
            weeks:''
        },
        spaces:[],
        permission_slip_required:''
    };
    var events = [];
    return {
        event: event,
        events : events
    };
});