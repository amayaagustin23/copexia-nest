import { Module, forwardRef } from '@nestjs/common';
import { EmailModule } from 'src/services/email/email.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CommentsModule } from '../comments/comments.module';
import { PostsAdminController } from './posts-admin.controller';
import { PostsPublicController } from './posts-public.controller';
import { PostsService } from './posts.service';

import { MessagingModule } from '../../services/messaging/messaging.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => CommentsModule),
    EmailModule,
    MessagingModule,
  ],
  controllers: [PostsAdminController, PostsPublicController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
