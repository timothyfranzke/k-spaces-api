'use strict';

import {Router} from 'express';
import * as controller from '../../vendor/user-detail/user-detail.controller';
import * as auth from '../../../services/vendor/auth/auth.service';

let router = new Router();

router.get('/', auth.hasRole('admin'), controller.list);
router.delete('/:id', auth.hasRole('admin'), controller.remove);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);

module.exports = router;
