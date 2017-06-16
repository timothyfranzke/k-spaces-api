commandCenterApp.factory('imageService', function(baseService, $mdDialog, $q){
    var defer = $q.defer();
    return {
        create: function(data, callback)
        {
            baseService.POST(IMAGE, data)
                .then(function(res){
                    if(res.status !== 200)
                    {
                        commandCenterService.setToast(res.status + ERROR_MESSAGE, TOAST_TYPES.ERROR)
                    }
                })
                .catch(function(err){commandCenterService.setToast(ERROR_MESSAGE + err, TOAST_TYPES.ERROR)})
                .finally(callback);
        },
        avatarGenerator : function(processImage){
            $mdDialog.show({
                controller:'avatarGeneratorDialogController',
                templateUrl: 'app/dialogs/avatar-generator/avatar-generator-dialog.html',
                clickOutsideToClose: true,
                fullscreen : false
            }).then(processImage);
        },
        resizeImage: function(image64){
            var i = new Image();
            i.onerror = function(err, m){ console.log(m)};

            i.onload = function ( ) {
                console.log(i.width);
                var image = {};
                var canvas = document.createElement("canvas");
                var thumbCanvas = document.createElement("canvas");

                var MAX_WIDTH = 300;
                var MAX_HEIGHT = 300;
                var width = i.width;
                var height = i.height;

                var THUMB_MAX_WIDTH = 50;
                var THUMB_MAX_HEIGHT = 50;
                var thumbWidth = i.width;
                var thumbHeight = i.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                if (thumbWidth > thumbHeight) {
                    if (thumbWidth > THUMB_MAX_WIDTH) {
                        thumbHeight *= THUMB_MAX_WIDTH / thumbWidth;
                        thumbWidth = THUMB_MAX_WIDTH;
                    }
                } else {
                    if (thumbHeight > THUMB_MAX_HEIGHT) {
                        thumbWidth *= THUMB_MAX_HEIGHT / thumbHeight;
                        thumbHeight = THUMB_MAX_HEIGHT;
                    }
                }
                canvas.width = i.width;
                canvas.height = i.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(i, 0, 0, i.width, i.height);

                thumbCanvas.width = thumbWidth;
                thumbCanvas.height = thumbHeight;
                var thumbCtx = thumbCanvas.getContext("2d");
                thumbCtx.drawImage(i, 0, 0, thumbWidth, thumbHeight);

                image.full = canvas.toDataURL("image/jpeg");
                image.thumb = thumbCanvas.toDataURL("image/jpeg");
                console.log(image);

                defer.resolve(image);
            };
            i.src =image64;
            //fr.readAsDataURL(the_file);
            return defer.promise;
        }
    }
});