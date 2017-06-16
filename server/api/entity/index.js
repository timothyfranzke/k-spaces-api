'use strict';

import {Router} from 'express';
import * as controller from './entity.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.post('/', auth.hasRole('sys-admin'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.get);

module.exports = router;


