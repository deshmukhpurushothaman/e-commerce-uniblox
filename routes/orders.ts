/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : Orders Routes
 **********************************************************************
 */
import express from 'express';
import { getOrders } from '../controllers/orders.controllers';

const router = express();

router.get('/', getOrders);

export default router;
