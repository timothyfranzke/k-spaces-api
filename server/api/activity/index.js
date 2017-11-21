'use strict';

import {Router} from 'express';
import * as controller from './activity.controller';
import * as controllerV2 from './activity.v2.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.post('/', auth.hasRole('faculty'), controller.create);
router.get('/', auth.isAuthenticated(), controller.list);

router.post('/v2/:studentId', auth.isAuthenticated(), controllerV2.create);
module.exports = router;


