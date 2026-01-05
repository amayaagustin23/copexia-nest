
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
    private readonly uploadDir = 'uploads';

    constructor() {
        this.ensureUploadDirExists();
    }

    private ensureUploadDirExists() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async upload(file: Express.Multer.File): Promise<string> {
        try {
            const extension =
                path.extname(file.originalname) ?? mime.extension(file.mimetype) ?? '.jpg';
            const fileName = `${uuid()}${extension}`;
            const filePath = path.join(this.uploadDir, fileName);

            await fs.promises.writeFile(filePath, file.buffer);

            const appUrl = process.env.APP_URL || 'http://localhost:4000';
            return `${appUrl}/downloads/${fileName}`;
        } catch (error) {
            throw new InternalServerErrorException('Failed to upload file');
        }
    }
}
