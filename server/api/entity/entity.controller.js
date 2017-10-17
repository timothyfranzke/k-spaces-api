export function get(req,res){
    var id = mongo.ObjectID(req.params.id);
    db.collection('entity').find( {"_id" : id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};

export function create(req,res){
    req.body.active = true;
    req.body.date_created = Date.now();

    db.collection('entity').insert(req.body, function(err, entityResult){
        if (err) return console.log(err);

        res.json(entityResult);
    })
};

export function list(req,res){
  let db = require('../../../services/db/db.service').getDb();
  let entity_id =  mongo.ObjectID(req.user.application_data.entity_id);

  var entity = db.collection('entities').findOne({"active":true, _id: entity_id });
  if(entity !== undefined && entity !== null){
    db.collection('entities').find({"active":true, _id: { $in: entity.associated_entities}}).toArray(function(err, result){
      if (err) return console.log(err);

      let entityResult = {
        data : result
      };
      res.json(entityResult);
    })
  }
};

export function update(req, res){
  let db = require('../../../services/db/db.service').getDb();
  let id = req.params.id;
  let entity_id = mongo.ObjectID(req.user.application_data.entity_id);

  db.collection('entity').findOneAndUpdate({"_id":entity_id}, {$push:{"associated_entities":id}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};

export function remove(req, res){
  let db = require('../../../services/db/db.service').getDb();
  let id = req.params.id;
  let entity_id = mongo.ObjectID(req.user.application_data.entity_id);

  db.collection('entity').findOneAndUpdate({"_id":entity_id}, {$pop:{"associated_entities":id}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};
