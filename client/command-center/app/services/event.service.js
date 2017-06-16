commandCenterApp.factory('eventService', function(baseService, eventModel, commandCenterService) {
    return {
        list: function(callback){
            if(eventModel.events.length > 0)
                callback(eventModel.events);
            else
            {
                baseService.LIST(EVENT)
                    .then(function(res) {
                        if (res.status === 200)
                        {
                            eventModel.events = res.data;
                            eventModel.events.forEach(function(event)
                            {
                                event.date.start_date = new Date(event.date.start_date);
                                console.log(event.date.start_date);
                            });
                            callback(eventModel.events);
                        }
                        else
                        {
                            commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR);
                        }
                    })
                    .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
            }
        },
        create: function(data, callback){
            baseService.POST(EVENT, data)
                .then(function(res){
                    if(res.status === 200)
                    {
                        console.log(res);
                        eventModel.events.push(res.data.ops[0]);
                        commandCenterService.setToast(EVENT_CREATE_MESSAGE, TOAST_TYPES.SUCCESS);
                    }
                    else
                    {
                        commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR)
                    }
                })
                .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
                .finally(callback);
        },
        get: function(id, callback){
            if(eventModel.events.length > 0){
                eventModel.events.forEach(function(event){
                    if(event._id === id)
                    {
                        callback(event);
                    }
                });
            }
            else
            {
                baseService.GET(EVENT, id)
                    .then(function(res){
                        var event = res.data[0];
                        event.date.start_date = new Date(event.date.start_date);
                        callback(event);
                    })
            }
        },
        update: function(data, id, callback){
            baseService.PUT(EVENT, data, id)
                .then(function(res){
                    if(res.status === 200)
                    {
                        eventModel.events.forEach(function(event){
                            if(event._id === id)
                            {
                                event = res.data.value[0];
                            }
                        });
                        commandCenterService.setToast(EVENT_UPDATE_MESSAGE, TOAST_TYPES.SUCCESS);
                    }
                    else
                    {
                        commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR)
                    }
                })
                .catch(function(err){
                    commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)
                })
                .finally(callback)
        },
        delete: function(id, callback){
            commandCenterService.confirmDialog(function(){
                baseService.DELETE(EVENT, id)
                    .then(function(res){
                        if(res.status === 200)
                        {
                            var i = 0;
                            eventModel.events.forEach(function(event){
                                if(event._id === id)
                                {
                                    eventModel.events.splice(i,1);
                                }
                                else
                                    i++;
                            });
                            commandCenterService.setToast(EVENT_DELETE_MESSAGE, TOAST_TYPES.SUCCESS);
                        }
                    })
                    .catch(function(err){
                        commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR);
                    })
                    .finally(callback);
            });
        }
    }
});