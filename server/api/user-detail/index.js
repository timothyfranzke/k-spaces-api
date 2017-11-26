'use strict';

import {Router} from 'express';
import * as controller from './user-detail.controller';
import * as controllerv2 from './user-detail.v2.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();
router.get('/v2/', auth.hasRole('admin'), controllerv2.list);
router.delete('/v2/:userId', auth.hasRole('admin'), controllerv2.remove);
//router.get('/v2/:id', auth.isAuthenticated(), controllerv2.get);
router.post('/v2/', auth.isAuthenticated(), controllerv2.create);
router.put('/v2/:userId', auth.isAuthenticated(), controllerv2.update);

router.get('/', auth.hasRole('admin'), controller.list);
router.delete('/:id', auth.hasRole('admin'), controller.remove);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:userId', auth.isAuthenticated(), controller.update);



module.exports = router;
