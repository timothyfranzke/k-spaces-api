'use strict';

import {Router} from 'express';
import * as controller from './search.controller';
import * as auth from '../../services/auth/auth.service';

let router = new Router();

router.get('/:term', auth.isAuthenticated(), controller.searching);

module.exports = router;
