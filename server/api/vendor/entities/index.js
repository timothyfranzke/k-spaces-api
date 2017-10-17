'use strict';

import {Router} from 'express';
import * as controller from './entities.controller';
import * as auth from '../../../services/auth/auth.service';

let router = new Router();

router.get('/', auth.hasRole('admin'), controller.list);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.remove);

module.exports = router;


