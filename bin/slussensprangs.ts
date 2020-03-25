#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SlussensprangsStack } from '../lib/slussensprangs-stack';

const app = new cdk.App();
new SlussensprangsStack(app, 'SlussensprangsStack');
