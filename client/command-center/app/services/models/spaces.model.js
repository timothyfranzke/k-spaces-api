commandCenterApp.factory('spacesModel', function(){
    var space = {
        legal_name:{
            first:'',
            middle:'',
            last:''
        },
        gender:'',
        birthday:'',
        parent_of: [],
        spouce: '',
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
    var spaces = [];
    return {
        space: space,
        spaces : spaces
    };
});