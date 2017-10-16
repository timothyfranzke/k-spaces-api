// 'use strict';
//
// import {Router} from 'express';
// import * as controller from './activity.controller';
// import * as auth from '../../services/auth/auth.service';
//
// let router = new Router();
//
// router.post('/', auth.hasRole('faculty'), controller.create);
// router.get('/:id', auth.isAuthenticated(), controller.get);
// router.get('/vendor/:vendor_id', auth.hasRole('faculty'), controller.ge)
// router.get('/student/:student_id', auth.isAuthenticated(), controller.getStudentActivity);
// router.get('/entity/:entity_id', auth.hasRole('admin'), controller.getEntityActivity);
// router.get('/spaces/:space_id', auth.hasRole('faculty'), controller.getSpaceActivity);
//
// module.exports = router;
//
//
