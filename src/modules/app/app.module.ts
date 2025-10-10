import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from 'src/config/envs/env-validation';
import I18nModuleConfig from 'src/config/i18n/i18n.config';
import { UploadModule } from 'src/services/aws/aws.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AuthModule } from '../auth/auth.module';
import { CategoriesModule } from '../categories/categories.module';
import { CommentsModule } from '../comments/comments.module';
import { ContactModule } from '../contact';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidationSchema,
    }),
    I18nModuleConfig(),
    PrismaModule,
    UploadModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
    CommentsModule,
    ContactModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
