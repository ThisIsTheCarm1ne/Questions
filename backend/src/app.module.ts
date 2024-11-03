import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { Poll } from "./polls/entities/poll.entity";
import { PollsController } from './polls/polls.controller';
import { VoteGateway } from './vote/vote.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: ['.env'],
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    TypeOrmModule.forFeature([Poll]),
  ],
  controllers: [AppController, PollsController],
  providers: [AppService, VoteGateway],
})
export class AppModule {}