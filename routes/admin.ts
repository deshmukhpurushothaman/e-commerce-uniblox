/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Admin Routes
 **********************************************************************/

import express from 'express';
import {
  generateDiscountCode,
  getStats,
} from '../controllers/admin.controller';

const router = express.Router();

// Route to generate a discount code for every nth order
router.post('/generate-discount', generateDiscountCode);

// Route to get admin statistics
router.get('/stats', getStats);

export default router;
