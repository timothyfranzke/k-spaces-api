'use strict';

import {Router} from 'express';
import * as controller from './entity.controller';
import * as controllerv2 from './entity.v2.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

//router.get('/:entityId', auth.hasRole('admin'), controllerv2.get);
//router.get('/', auth.hasRole('admin'), controllerv2.list);

router.post('/', auth.hasRole('sys-admin'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.get('/', auth.hasRole('admin'), controller.list);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

module.exports = router;


