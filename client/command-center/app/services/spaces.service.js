commandCenterApp.factory('spacesService', function(baseService, spacesModel, commandCenterService) {
    return {
        list: function(callback){
            if(spacesModel.spaces.length > 0)
                callback(spacesModel.spaces);
            else
            {
                baseService.LIST(SPACES)
                    .then(function(res) {
                        if (res.status === 200)
                        {
                            spacesModel.spaces = res.data;
                            callback(spacesModel.spaces);
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
            baseService.POST(SPACES, data)
                .then(function(res){
                    if(res.status === 200)
                    {
                        console.log(res);
                        spacesModel.spaces.push(res.data.ops[0]);
                        commandCenterService.setToast(SPACE_CREATE_MESSAGE, TOAST_TYPES.SUCCESS);
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
            if(spacesModel.spaces.length > 0){
                spacesModel.spaces.forEach(function(space){
                    if(space._id === id)
                    {
                        callback(space);
                    }
                });
            }
            else
            {
                baseService.GET(SPACES, id)
                    .then(function(res){
                       callback(res.data[0]);
                    })
            }
        },
        update: function(data, id, callback){
            baseService.PUT(SPACES, data, id)
                .then(function(res){
                    if(res.status === 200)
                    {
                        spacesModel.spaces.forEach(function(space){
                            if(space._id === id)
                            {
                                space = res.data.value[0];
                            }
                        });
                        commandCenterService.setToast(SPACE_UPDATE_MESSAGE, TOAST_TYPES.SUCCESS);
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
                baseService.DELETE(SPACES, id)
                    .then(function(res){
                        if(res.status === 200)
                        {
                            var i = 0;
                            spacesModel.spaces.forEach(function(space){
                                if(space._id === id)
                                {
                                    spacesModel.spaces.splice(i,1);
                                }
                                else
                                    i++;
                            });
                            commandCenterService.setToast(SPACE_DELETE_MESSAGE, TOAST_TYPES.SUCCESS);
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