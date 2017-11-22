'use strict';

import {Router} from 'express';
import * as controllerV2 from './notes.v2.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.post('/v2/:studentId', auth.isAuthenticated(), controllerV2.create);
router.delete('/v2/:studentId', auth.hasRole('faculty'), controllerV2.remove);
router.get('/v2/', auth.isAuthenticated(), controllerV2.list);
router.get('/v2/:noteId', auth.isAuthenticated(), controllerV2.get);
module.exports = router;


