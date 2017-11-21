'use strict';

import {Router} from 'express';
import * as controller from './space.controller';
import * as auth from '../../services/auth/auth.service';
import * as controllerV2 from './space.v2.controller';

let router = new Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.get('/', auth.hasRole('admin'), controller.list);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

router.post('/v2/', auth.hasRole('admin'), controllerV2.create);

module.exports = router;


