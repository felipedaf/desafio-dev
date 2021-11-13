import { Injectable } from '@nestjs/common';

@Injectable()
export class CnabService {
  upload(file) {
    const content = file.buffer.toString('utf-8');
    console.log(file);
    console.log(content);
    return { message: 'Upload successfully done!' };
  }
}
