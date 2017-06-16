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