commandCenterApp.factory('locationService', function(baseService, locationModel, commandCenterService) {
    return {
        list: function(callback){
            if(locationModel.locations.length > 0)
                callback(locationModel.locations);
            else
            {
                baseService.LIST(LOCATION)
                    .then(function(res) {
                        if (res.status === 200)
                        {
                            locationModel.locations = res.data;
                            callback(locationModel.locations);
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
            baseService.POST(LOCATION, data)
                .then(function(res){
                    if(res.status === 200)
                    {
                        console.log(res);
                        locationModel.locations.push(res.data.ops[0]);
                        commandCenterService.setToast(LOCATION_CREATE_MESSAGE, TOAST_TYPES.SUCCESS);
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
            if(locationModel.locations.length > 0){
                locationModel.locations.forEach(function(location){
                    if(location._id === id)
                    {
                        callback(location);
                    }
                });
            }
            else
            {
                baseService.GET(LOCATION, id)
                    .then(function(res){
                        callback(res.data[0]);
                    })
            }
        },
        update: function(data, id, callback){
            baseService.PUT(LOCATION, data, id)
                .then(function(res){
                    if(res.status === 200)
                    {
                        locationModel.locations.forEach(function(location){
                            if(location._id === id)
                            {
                                location = res.data.value[0];
                            }
                        });
                        commandCenterService.setToast(LOCATION_UPDATE_MESSAGE, TOAST_TYPES.SUCCESS);
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
        delete: function(id){
            commandCenterService.confirmDialog(function(){
                baseService.DELETE(LOCATION, id)
                    .then(function(res){
                        if(res.status === 200)
                        {
                            var i = 0;
                            locationModel.locations.forEach(function(location){
                                if(location._id === id)
                                {
                                    locationModel.locations.splice(i,1);
                                }
                                else
                                    i++;
                            });
                            commandCenterService.setToast(LOCATION_UPDATE_MESSAGE, TOAST_TYPES.SUCCESS);
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