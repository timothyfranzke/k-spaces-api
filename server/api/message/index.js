'use strict';

import {Router} from 'express';
import * as controller from './message.controller'
import * as auth from '../../services/auth/auth.service';

let router = new Router();

//router.post('/', auth.hasRole('admin'), controller.send);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.get('/', auth.isAuthenticated(), controller.list);
//router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

module.exports = router;


