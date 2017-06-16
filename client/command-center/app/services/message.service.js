commandCenterApp.factory('messageService', function(baseService, messageModel, $mdDialog, $sce, commandCenterService) {
    return {
        read: function(){

        },
        list: function(callback){
            if(messageModel.messages.length > 0)
                callback(messageModel.messages);
            else
            {
                baseService.LIST(MESSAGE)
                    .then(function(res) {
                        if (res.status === 200)
                        {
                            messageModel.messages = res.data;
                            res.data.forEach(function(item){
                                item.body = $sce.trustAsHtml(item.body)
                            });
                            callback(messageModel.messages);
                        }
                        else
                        {
                            commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR);
                        }
                    })
                    .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
            }
        },
        get: function(id, callback){
            if(messageModel.messages.length > 0){
                messageModel.messages.forEach(function(message){
                    if(message._id === id)
                    {
                        callback(message);
                    }
                });
            }
            else
            {
                baseService.GET(MESSAGE, id)
                    .then(function(res){
                        callback(res.data[0]);
                    })
            }
        },
        create: function(data, callback){
            baseService.POST(MESSAGE, data)
                .then(function(res){
                    if(res.status === 200)
                    {
                        console.log(res);
                        res.body = $sce.trustAsHtml(res.body);
                        messageModel.messages.push(res);
                        commandCenterService.setToast(MESSAGE_SENT_MESSAGE, TOAST_TYPES.SUCCESS);

                        callback(res._id);
                    }
                    else
                    {
                        console.log(res);
                        commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR)
                    }
                })
                .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
                .finally(callback);
        },
        delete: function(message){

        },
        messageDialog: function(callback){
            $mdDialog.show({
                controller:'message-compose-controller',
                templateUrl: 'app/dialogs/message-compose/message-compose-dialog.html',
                clickOutsideToClose: true,
                fullscreen : false
            }).then(function(result){
                callback(result);
            }).finally(function(){commandCenterService.setLoader(false)})
        }
    }
});