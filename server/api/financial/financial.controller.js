/**
 * Created by timothyfranzke on 5/30/17.
 */
export function period(req,res){
    let db = require('../../services/db/db.service').getDb();
    var period = mongo.ObjectID(req.params.period);

    var startDate = new Date();
    startDate = startDate.setMonth()
    db.collection('space').find({}).toArray(function(err, result){

    });

    db.collection('event').find( {"_id" : id}).toArray(function(err,result){
        if (err) return console.log(err);

        res.json(result);
    })
};