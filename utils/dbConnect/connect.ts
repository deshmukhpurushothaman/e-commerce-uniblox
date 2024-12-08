/**********************************************************************
 * Changelog
 * All notable changes to this project will be documented in this file.
 **********************************************************************
 *
 * Author            : Deshmukh P
 *
 * Date created      : 08/12/2024
 *
 * Purpose           : mongo connections
 **********************************************************************
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const mongoUrl = process.env.DATABASE_CONNECTION_STRING;

// MONGODB CONNECTION & Admin cred
export const connectDB = async function () {
  try {
    await mongoose.connect(mongoUrl);
    console.info('💎 MongoDB connected!!');
    return;
  } catch (error: any) {
    console.error(error, '💀 something went wrong');
    return;
  }
};
