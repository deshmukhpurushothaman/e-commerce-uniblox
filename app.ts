/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : initiate express server and basic configs
 **********************************************************************
 */

import 'dotenv/config';
import process from 'node:process';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import useragent from 'express-useragent';
import nocache from 'nocache';
import orders from './routes/orders';
import products from './routes/product';
import cart from './routes/cart';
import admin from './routes/admin';
import { connectDB } from './utils/dbConnect/connect';

export const startExpressServer = async () => {
  try {
    const app = express();

    await connectDB();

    const options = {
      limit: '1kb',
    };

    /* API LEVEL MIDDLEWARES
     */
    app.use(nocache());
    app.use(cors());
    app.use(express.json(options));
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:
    app.use((err: any, req: any, res: any, next: any) => {
      // @ts-ignore
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send('Invalid data'); // Bad request
      }
      next();
    });
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Forces all connections through https & hides backend tech stack
    app.use(helmet());

    // for all complex preflight requests
    app.options('*', cors());

    // guard against $ injections attacks in mongoDB
    // replaces $ and.by default in body, params, query, headers
    app.use(mongoSanitize());

    // useragent exposure to application & could be grabbed via req.useragent
    app.use(useragent.express());

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err.code !== 'EBADCSRFTOKEN') return next(err);
      // handle CSRF token errors here
      res.status(403);
      res.send('form was tampered with');
    });

    app.use('/api/orders', orders);
    app.use('/api/products', products);
    app.use('/api/cart', cart);
    app.use('/api/admin', admin);

    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.info('🎇 Server is running on port:' + PORT);
    });
  } catch (error: any) {
    console.error(error);
    process.exitCode = 1;
    return;
  }
};
