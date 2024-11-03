import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Poll } from 'src/polls/entities/poll.entity';
import * as process from "node:process";

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB,
    entities: [Poll],
    synchronize: true,
  }),
);