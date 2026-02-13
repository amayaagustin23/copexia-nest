import { Module } from '@nestjs/common';
import { EmailModule } from '../../services/email/email.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

import { MessagingModule } from '../../services/messaging/messaging.module';

@Module({
  imports: [PrismaModule, EmailModule, MessagingModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
