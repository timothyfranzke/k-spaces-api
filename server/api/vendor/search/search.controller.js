import * as search from '../../../services/search/search.service'
let logging     = require('../../../services/logging/logging.service');
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

export function searchEamil(req, res){
  console.log(req);
    search.searchByEamil(req.email, function(result){
      if(result === undefined || result.length <= 0 ){
        let resultObj = {"result":false};
        res.json(resultObj)
      }
      else{
        let resultObj = {"result":true};
        res.json(resultObj)
      }
    })
};

export function searchEntity(req, res){
  console.log(req);
  search.searchEntityByName(req.email, function(result){
    if(result === undefined || result.length <= 0 ){
      let resultObj = {"result":false};
      res.json(resultObj)
    }
    else{
      let resultObj = {"result":true};
      res.json(resultObj)
    }
  })
};

export function searchVendor(req, res){
  console.log(req);
  search.searchVendorByName(req.email, function(result){
    if(result === undefined || result.length <= 0 ){
      let resultObj = {"result":false};
      res.json(resultObj)
    }
    else{
      let resultObj = {"result":true};
      res.json(resultObj)
    }
  })
};
