commandCenterApp.factory('userModel', function(){
    var user = {
        legal_name:{
            first:'',
            middle:'',
            last:''
        },
        gender:'',
        birthday:'',
        parent_of: [],
        spouse: '',
        photo:'',
        email:'',
        primary_phone:'',
        alt_phone:'',
        address:{
            line_one:'',
            line_two:'',
            line_three:'',
            city:'',
            state:'',
            zip:''
        },
        employer:'',
        occupation:'',
        notes:''
    };
    var users = [];
   return {
       user: user,
       users : users
   };
});

