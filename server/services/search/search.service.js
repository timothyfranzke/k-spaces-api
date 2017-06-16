

export function searchByUserName(term, callback){
    let db = require('../../services/db/db.service').getDb();
    var expression = new RegExp('^' + term);
    console.log(expression);
    db.collection('user')
        .find({
                $or:[
                    {"legal_name.first":expression},
                    {"legal_name:last":expression}
                ]
            },
            {legal_name:1, preferred_name:1}

        )
        .toArray(function(err, result){
            if (err) return console.log(err);
            console.log(result);
            callback(result);
        });
};