'use strict';

import {Router} from 'express';
import * as controller from './event.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.post('/previous/:periods', auth.hasRole('admin'), controller.periods);
router.get('/monthly', auth.hasRole('admin'), controller.monthly);
router.get('/yearly', auth.hasRole('admin'), controller.yearly);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

module.exports = router;


