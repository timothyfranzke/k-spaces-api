'use strict';

import {Router} from 'express';
import * as controller from './profile.controller';
import * as controllerv2 from './profile.v2.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.get('/', auth.isAuthenticated(), controller.get);
router.put('/:id', auth.isAuthenticated(), controller.update);

router.get('/v2/', auth.isAuthenticated(), controllerv2.get);
router.put('/v2/', auth.isAuthenticated(), controllerv2.update);


module.exports = router;
