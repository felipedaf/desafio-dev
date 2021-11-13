import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CnabService } from './cnab.service';

@Controller('cnab')
export class CnabController {
  constructor(private readonly cnabService: CnabService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.cnabService.upload(file);
  }
}
