import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    return {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // uri: process.env.MONGO_URI,
      uri: 'mongodb://wright-admin:hxG7yW4JN5@159.223.192.173:27017/quix-note-db?authSource=admin&retryWrites=true&w=majority',
    };
  }
}
