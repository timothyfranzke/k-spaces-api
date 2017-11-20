let mongo = require('mongodb');

//services
let config    = require('../../config/configuration');
let logging   = require('../../services/logging/logging.service');
let groupMgmt = require('../../services/tech-spaces-api/group_mgmt.service');

//models
let Location  = require('../../models/location');
let Address   = require('../../models/address');
let Avatar    = require('../../models/avatar');
let Hours     = require('../../models/hours');
let DaysOfWeek  = require('../../models/daysOfWeek');

//constants
const CLASS_NAME  = 'location.v2.controller';

//location
export function list(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);

  let entity_id = req.user.entity_id;
  logger.DEBUG(config.information.COLLECTION_QUERY("entity", entity_id));


  Location.find({entity_id:entity_id, is_active:true})
    .exec(function(err, locationResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
        res.sendStatus(422);
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("location", locationResult));

          let locationResponse = {
            data: locationResult
          };

          res.json(locationResponse);
        }
      }
    });
}

export function get(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(CLASS_NAME, list.name, config.log_level);

  let id = req.params.id;
  logger.DEBUG(config.information.COLLECTION_QUERY("location", id));


  Location.findById(id)
    .exec(function(err, locationResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
        res.sendStatus(422);
      }
      else {
        {
          logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("location", locationResult));

          let locationResponse = {
            data: {
              location  : locationResult,
              group     : groupMgmt.get(id)
            }
          };

          res.json(locationResponse);
        }
      }
    });
}

export function create(req,res){
  let logger = logging.Logger(CLASS_NAME, create.name, config.log_level);

  req.body.active = true;
  req.body.date_created = Date.now();
  let location = new Location(req.body);

  location.save(function(err, locationResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
      res.sendStatus(422);
    }
    else {
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("location", locationResult));

      let spacesGroupList = [];
      if(req.body.spaces !== undefined){
        req.body.spaces.forEach(function(spaceId){
          let spacesGroupObject = {
            _id:spaceId,
            type:"space"
          };
          spacesGroupList.push(spacesGroupObject);
        });
        let locationGroup = {
          _id:locationResult._id,
          type:"location",
          group_members:spacesGroupList
        };
        groupMgmt.create(locationGroup, function(err, groupMgmtResponse){
          if (err){
            logger.ERROR(err, config.exceptions.COLLECTION_FAILED("location"));
          }

          res.json(locationResult);

        });
      }
      else {
        res.json(locationResult);
      }
    }
  });
};

export function update(req, res){
  let db = require('../../services/db/db.service').getDb();
  var id = mongo.ObjectID(req.params.id);
  delete req.body._id;
  var entity_id = req.user.entity_id;

  db.collection('location').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : req.body}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};

export function remove(req, res){
  let db = require('../../services/db/db.service').getDb();
  var id = mongo.ObjectID(req.params.id);
  var entity_id = req.user.entity_id;

  db.collection('location').findOneAndUpdate({"_id":id, "entity_id":entity_id}, {$set : {"active":false}}, function(err, result){
    if (err) return console.log(err);

    res.json(result);
  })
};
