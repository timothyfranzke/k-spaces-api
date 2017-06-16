import * as search from '../../services/search/search.service'

export function searching(req, res){
    var term = req.params.term;
    var type = 'user';

    switch(type)
    {
        case 'user':
            search.searchByUserName(term, function(result){
                res.json(result);
            });
    }
};