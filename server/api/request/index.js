'use strict';

import {Router} from 'express';
import * as auth from '../../services/auth/auth.service';
import * as controllerV2 from './request.v2.controller';

let router = new Router();

router.post('/v2/', auth.hasRole('admin'), controllerV2.send);
router.post('/v2/:requestId', auth.hasRole('admin'), controllerV2.accept);
