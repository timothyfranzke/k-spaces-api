let logging     = require('../logging/logging.service');
let className   = "financial.service";
var mongo = require('mongodb');

export function createPayPeriodRecord(entity_id, callback){
  let methodNAme = "createPayPeriodRecord";
  logging.INFO(className, methodNAme, "creating pay period for entity " + entity_id);

  let db = require('../../services/db/db.service').getDb();
  let payPeriod = {
    "start_date": new Date(),
    "active": true,
    "entity_id":entity_id
  };
  try{

    db.collection('pay_period').insert(payPeriod, function(err, pay_result){
      callback(err, pay_result.insertedIds[0]);
    });
  }
  catch(exception){
    logging.ERROR(exception, className, methodNAme);
    callback(exception);
  }
};

export function createPaymentRecord(entity_id, period_id, user, callback){
  let methodNAme = "createPaymentRecord";
  let db = require('../../services/db/db.service').getDb();
  let payment_record = {
    "period_id": period_id,
    "entity_id": entity_id,
    "date": "2017/06/03 14:10:58",
    "subtotal":0,
    "parent": {
      "_id":user._id,
      "legal_name":user.legal_name
    },
    "students": [],
    "status": [
      {
        "id": 12,
        "name": "Payment-due",
        "color": "md-green-500-bg",
        "date": "2015/07/15 15:48:00"
      }
    ],
    "payment": {}
  };

  db.collection('payment').insert(payment_record, function(err, payment_result){
    if(err) {logging.ERROR(err, className, methodNAme, "failed to create a payment record for " + payment_record.parent._id)}
    else {
      logging.INFO(className,methodNAme,"created payment record for " + payment_record.parent._id + " with payment_id: " + payment_result.insertedIds[0])

      callback(null, payment_result.insertedIds[0])
    }
  });
};

export function addStudentPayments(entity_id, period_id, callback){
  let methodNAme = "addStudentPayments";
  let db = require('../../services/db/db.service').getDb();

  logging.INFO(className, methodNAme, "updating payment record under entity " + entity_id);

  try{
    db.collection('tuition_rate').find({"active":true, "entity_id":entity_id}).toArray(function(err, tuition_result){
      logging.INFO(className, methodNAme, "querying tuition_rate; found " + tuition_result.length);

      tuition_result.forEach(function(tuitionRateRecord){
        if(tuitionRateRecord.students !== undefined)
        {
          tuitionRateRecord.students.forEach(function(student){
            logging.INFO(className, methodNAme, "querying payment with period_id " + period_id + " and parent_id " + student.parent_id);

            let parent_id = "";
            if(typeof student.parent_id === "string" && student.parent_id.length > 1)
            {
              parent_id = mongo.ObjectID(student.parent_id);
            }
            period_id = mongo.ObjectID(period_id);

            db.collection('payment').findOne({"period_id":period_id, "parent._id":parent_id}, function(err, payment_result){
              if(err || payment_result == null)
              {
                logging.INFO(className, methodNAme, "query result payment: NO RESUTLS from parent " + student.parent_id);
              }
              else {
                logging.INFO(className, methodNAme, "query result payment: " + JSON.stringify(payment_result));
                let studentRecord = {
                  "firstName": student.firstName,
                  "lastName": student.lastName,
                  "price": tuitionRateRecord.priceTaxExcl,
                  "total": tuitionRateRecord.priceTaxExcl + (tuitionRateRecord.taxRate * tuitionRateRecord.priceTaxExcl ),
                  "avatar": "assets/images/ecommerce/product-image-placeholder.png"
                };
                let total = payment_result.subtotal + tuitionRateRecord.priceTaxExcl;
                if (payment_result.students === undefined){
                  payment_result.students = [];
                }
                payment_result.students.push(studentRecord);
                payment_result.subtotal += tuitionRateRecord.priceTaxExcl;

                logging.INFO(className, methodNAme, "updating payment id " + payment_result._id + " tuition rate id " + tuitionRateRecord._id + " record price: " + tuitionRateRecord.priceTaxExcl + " subtotal: " + payment_result.subtotal);

                db.collection('payment').update({"_id":payment_result._id}, {$set: {"subtotal": total, "date_modified": new Date()}}, {$push:{"students": studentRecord}}, function(err, updateResult){
                  if(err){
                    logging.ERROR(err, className, methodNAme, "failed to update payment for " + student.parent_id);
                  }
                  else {
                    logging.INFO(className, methodNAme, "updated payment record for " + student.parent_id);
                  }
                })
              }
            })
          })
        }
      })
    });
  }
  catch(exception){
    logging.ERROR(exception, className, methodNAme, "Exception while updating payment record");
  }
  finally{
    callback();
  }
};
