#!/usr/bin/env node
import 'source-map-support/register';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from 'dotenv';
dotenv.config();

import * as cdk from '@aws-cdk/core';
import { SlussensprangsStack } from '../lib/slussensprangs-stack';

const app = new cdk.App();
new SlussensprangsStack(app, 'SlussensprangsStack', { tags: { system: process.env.SYSTEM_ID! } });
