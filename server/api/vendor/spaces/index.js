'use strict';

import {Router} from 'express';
import * as controller from './space.controller';
import * as auth from '../../../services/vendor/auth/auth.service';

let router = new Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.get('/', auth.hasRole('admin'), controller.list);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

module.exports = router;


