let objectID = require('mongodb').ObjectId;
let logging = require('../../services/logging/logging.service');
let config = require('../../config/configuration');
let className = 'activity.controller';

export function list(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, list.name, config.log_level);
  let user_id = objectID(req.user.id);
  let entity_id = req.user.entity_id;
  let page = 0;
  try{
    page = parseInt(req.query.page);
  }
  catch(ex){
    logger.ERROR(ex, "unable to parse page")
  }
  logger.INFO("page : " + page);

  //parent
   if (req.user.roles[0] === config.userRoles.PARENT){
    let userDetailQuery = {_id:user_id};
    logger.DEBUG(config.information.COLLECTION_QUERY("userDetail", userDetailQuery));

    db.collection("userDetail").findOne(userDetailQuery, function(err, userDetailResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("userDetail"));
        return res.sendStatus(422);
      }
      else {
        if(userDetailResult !== undefined){
          if(userDetailResult.students !== undefined && userDetailResult.students.length > 0){
            let activityQuery = {student_id: {$in:userDetailResult.students}};
            logger.DEBUG(config.information.COLLECTION_QUERY("activity", query));

            db.collection('activity').find(activityQuery).skip(page).limit(20).toArray(function(err, activityResult){
              if(err){
                logging.ERROR(err, className, list.name, config.exceptions.COLLECTION_FAILED("activity"));
                return res.sendStatus(422);
              }
              else{
                logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("activity", activityResult));

                let activityResponse = {
                  data: activityResult
                };

                res.json(activityResponse);
              }
            });
          }
          else {
            logger.WARN(config.exceptions.COLLECTION_RETURNED_NULL("activity"));
            return res.json([]);
          }
        }else{
          logger.WARN(config.exceptions.COLLECTION_RETURNED_NULL("userDetail"));
          return res.json([]);
        }
      }
    });
  }
  //faculty
  else if (req.user.roles[0] === config.userRoles.FACULTY){
    let spacesQuery = {faculty:user_id.str};
    logger.DEBUG(config.information.COLLECTION_QUERY("spaces", spacesQuery));

    db.collection('spaces').findOne(spacesQuery, function(err, spaceResult){
      if (err) {
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("spaces"));
        return res.sendStatus(422);
      }
      else {
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("spaces", spaceResult));
        if(spaceResult !== undefined && spaceResult !== null){
          let activityQuery = {space_id:spaceResult._id.toString()};
          logger.DEBUG(config.information.COLLECTION_QUERY("activity", activityQuery));

          db.collection('activity').find(activityQuery).skip(page).limit(20).toArray(function(err, activityResult){
            if (err){
              logger.ERROR(err, config.exceptions.COLLECTION_FAILED("activity"));
              return res.sendStatus(422);
            }
            else{
              logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("activity", activityResult));

              let activityResponse = {
                data: activityResult
              };

              res.json(activityResponse);
            }
          });
        }
      }
    });
  }
  //admin
  else if(req.user.roles[0] === config.userRoles.ADMIN){
    let activityQuery = {entity_id:entity_id};
    logger.DEBUG(config.information.COLLECTION_QUERY("activity", activityQuery));

    db.collection('activity').find(activityQuery).skip(page).limit(20).toArray(function(err, activityResult){
      if (err){
        logger.ERROR(err, config.exceptions.COLLECTION_FAILED("activity"));
        return res.sendStatus(422);
      }
      else{
        logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("activity", activityResult));

        let activityResponse = {
          data: activityResult
        };

        res.json(activityResponse);
      }
    });
  }
  else{
    res.json([]);
  }

}

export function create(req,res){
  let db = require('../../services/db/db.service').getDb();
  let logger = logging.Logger(className, create.name, config.log_level);

  req.body.active = true;
  req.body.date_created = Date.now();

  logger.DEBUG(config.information.COLLECTION_INSERT("activity", req.body));
  db.collection('activity').insert(req.body, function(err, activityResult){
    if (err){
      logger.ERROR(err, config.exceptions.COLLECTION_FAILED("activity"));
      return res.sendStatus(422);
    }
    else{
      logger.DEBUG(config.information.COLLECTION_SUCCEEDED_WITH_RESULT("activity", activityResult));

      res.json(activityResult);
    }
  })
}

