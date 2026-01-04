
import { Module } from '@nestjs/common';
import { UploadService } from './storage.service';

@Module({
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule { }
