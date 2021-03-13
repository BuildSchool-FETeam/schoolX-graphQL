import { ReadStream } from 'typeorm/platform/PlatformTools';

export interface FileUploadType {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}
