import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { CrawlersModule } from './crawlers/crawlers.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    DatabaseModule,
    UsersModule,
    IamModule,
    CrawlersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
