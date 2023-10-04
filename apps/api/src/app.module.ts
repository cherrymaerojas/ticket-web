import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { CrawlersModule } from './crawlers/crawlers.module';
import { TicketsModule } from './tickets/tickets.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    DatabaseModule,
    UsersModule,
    IamModule,
    CrawlersModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
