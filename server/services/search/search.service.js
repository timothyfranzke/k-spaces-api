let logging     = require('../logging/logging.service');
let className   = "search.service";

export function searchByUserName(term, callback){
    let methodNAme = "searchByUserName";
    logging.INFO(className, methodNAme, "searching with " + term);

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
            if (err)
            {
              logging.ERROR(err, className, methodNAme, "error with term " + term);
              callback(err);
            }
            logging.INFO(className, methodNAme, "search result " + result);
            callback(result);
        });
};
