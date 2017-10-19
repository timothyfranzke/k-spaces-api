// export function getEntityActivity(req,res){
//   var id = mongo.ObjectID(req.params.id);
//   var page = req.params.page;
//
//   db.collection('activity').find({"entity_id":entity_id}).skip(pageNumber).limit(20).toArray(function(err,result){
//     if (err) return console.log(err);
//
//     res.json(result);
//   })
// };
//
// export function getSpaceActivity(req, res){
//   var space_id = mongo.ObjectID(req.params.id);
//   var page = req.params.page;
//   var entity_id = req.user.entity_id;
//
//   db.collection('activity').find({"entity_id":entity_id, "space_id":space_id}).skip(page).limit(20).toArray(function(err,result){
//     if (err) return console.log(err);
//
//     res.json(result);
//   })
// };
//
// export function getStudentActivity(req,res){
//   var id = mongo.ObjectID(req.params.id);
//   var student_id = mongo.ObjectID(req.params.student_id);
//   var page = req.params.page;
//   var vendor_id = req.user.entity_id;
//
//   db.collection('activity').find({"vendor_id":vendor_id}).skip(page).limit(20).toArray(function(err,result){
//     if (err) return console.log(err);
//
//     res.json(result);
//   })
// };
//
// export function create(req,res){
//   req.body.active = true;
//   req.body.date_created = Date.now();
//
//   db.collection('activity').insert(req.body, function(err, entityResult){
//     if (err) return console.log(err);
//
//     res.json(entityResult);
//   })
// };
//
// export function remove(req, res){
//   let db = require('../../services/db/db.service').getDb();
//   var id = mongo.ObjectID(req.params.id);
//   var entity_id = req.user.entity_id;
//
//   db.collection('activity').findOneAndUpdate({"_id":id}, {$set : {"active":false}}, function(err, result){
//     if (err) return console.log(err);
//
//     res.json(result);
//   })
// };
