import { HttpException, Injectable } from '@nestjs/common'
import { ReadStream } from 'typeorm/platform/PlatformTools'
import * as fs from 'fs'
import { ImageProcessService } from './imageProcess.service'

@Injectable()
export class FileService {
  constructor(private imageProcessService: ImageProcessService) {}
  async writeFileLocal(fileName: string, readStream: ReadStream) {
    return new Promise<string>(async (resolve) => {
      try {
        const processedStream = await this.imageProcessService.processImage(
          readStream,
          {
            resize: {
              height: 100,
              width: 100,
              position: 'center',
            },
          }
        )

        const writable = fs.createWriteStream(`/home/app/upload/${fileName}`)

        processedStream.pipe(writable).on('finish', () => {
          resolve(`/home/app/upload/${fileName}`)
        })
      } catch (err) {
        throw new HttpException(err.message, 500, { cause: new Error(err) })
      }
    })
  }
}
