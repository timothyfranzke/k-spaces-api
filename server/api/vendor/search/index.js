'use strict';

import {Router} from 'express';
import * as controller from './search.controller';
import * as auth from '../../../services/vendor/auth/auth.service';

let router = new Router();

router.get('/:term', auth.isAuthenticated(), controller.searching);
router.get('/email/:email', auth.isAuthenticated(), controller.searchEamil);
router.get('/entity/:name', auth.isAuthenticated(), controller.searchEntity);
router.get('/vendor/:vendor', auth.isAuthenticated(), controller.searchVendor);

module.exports = router;
