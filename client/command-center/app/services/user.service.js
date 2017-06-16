commandCenterApp.factory('userService', function(baseService, authenticationService, userModel, commandCenterService) {
    return {
        create: function(data, callback){
            var registrationData = {};
            registrationData.email = data.email;
            registrationData.application_data = [];
            registrationData.application_data.push({entity_id:"1234"});
            registrationData.redirect = "faculty";
            baseService.GET(BASE_URL, GEN_PW).then(function(res){
                registrationData.password = res.data;
                authenticationService.register(registrationData, REGISTER).then(function(res){
                    data.auth_id = res.id;
                    data.temp_password = registrationData.password;
                    baseService.POST(USER, data)
                        .then(function(res){
                            if(res.status === 200)
                            {
                                userModel.users.push(res.data.ops[0]);
                                commandCenterService.setToast(USER_CREATE_MESSAGE, TOAST_TYPES.SUCCESS);
                                callback(res.data.ops[0]._id);
                            }
                            else
                            {
                                commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR)
                            }
                        })
                        .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
                        .finally(callback);
                })
            })
        },
        get: function(id, callback){
            if(userModel.users.length > 0){
                userModel.users.forEach(function(user){
                    if(user._id === id)
                    {
                        callback(user);
                    }
                });
            }
            else
            {
                baseService.GET(USER, id)
                    .then(function(res){
                        callback(res.data[0]);
                    })
            }
        },
        list: function(callback){
            if(userModel.users.length > 0)
                callback(userModel.users);
            else
            {
                baseService.LIST(USER)
                    .then(function(res) {
                        if (res.status === 200)
                        {
                            userModel.users = res.data;
                            callback(userModel.users);
                        }
                        else
                        {
                            commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR);
                        }
                    })
                    .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
            }
        },
        update: function(data, id, callback){
            baseService.PUT(USER, data, id)
                .then(function(res){
                    if(res.status === 200)
                    {
                        userModel.users.forEach(function(user){
                            if(user._id === id)
                            {
                                user = res.data.value[0];
                            }
                        });
                        commandCenterService.setToast(USER_UPDATE_MESSAGE, TOAST_TYPES.SUCCESS);
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
                baseService.DELETE(USER, id)
                    .then(function(res){
                        if(res.status === 200)
                        {
                            var i = 0;
                            userModel.users.forEach(function(user){
                                if(user._id === id)
                                {
                                    userModel.users.splice(i,1);
                                }
                                else
                                    i++;
                            });
                            commandCenterService.setToast(USER_DELETE_MESSAGE, TOAST_TYPES.SUCCESS);
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