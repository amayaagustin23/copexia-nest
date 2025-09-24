import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PostsAdminController } from './posts-admin.controller';
import { PostsPublicController } from './posts-public.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostsAdminController, PostsPublicController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
