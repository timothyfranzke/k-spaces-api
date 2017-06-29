import * as search from '../../services/search/search.service'
let logging     = require('../../services/logging/logging.service');
let className   = "search.controller";

export function searching(req, res){
    let methodName = "searching";
    var term = req.params.term;
    var type = 'user';
    logging.INFO(className, methodName, "searching with term " + term);

    switch(type)
    {
        case 'user':
            search.searchByUserName(term, function(result){
                res.json(result);
            });
    }
};
