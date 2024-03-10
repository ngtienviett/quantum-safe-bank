import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';

@Controller('upload')
export class UploadController {
  @Post('identity')
  @UseInterceptors(
    FileInterceptor('identity', { storage: storageConfig('identity') }),
  )
  uploadIdentity(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return file.destination + '/' + file.filename;
  }
}
