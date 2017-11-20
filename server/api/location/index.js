'use strict';

import {Router} from 'express';
import * as controller from './location.controller';
import * as controllerV2 from './location.v2.controller';
import * as auth from '../../services/auth/auth.service';

let express = require('express');

let router = new Router();

router.post('/', auth.hasRole('admin'), controller.create);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.get('/', auth.hasRole('admin'), controller.list);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

router.post('/v2/', auth.hasRole('admin'), controllerV2.create);
router.get('/v2/:id', auth.isAuthenticated(), controllerV2.get);
router.get('/v2/', auth.hasRole('admin'), controllerV2.list);

module.exports = router;


