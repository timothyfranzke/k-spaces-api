'use strict';

import {Router} from 'express';
import * as controller from './profile.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.get('/', auth.isAuthenticated(), controller.get);
router.put('/', auth.isAuthenticated(), controller.update);

module.exports = router;