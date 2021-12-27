import { Injectable } from '@nestjs/common'
import { ReadStream } from 'typeorm/platform/PlatformTools'
import * as fs from 'fs'

@Injectable()
export class FileService {
  async writeFileLocal(fileName: string, readStream: ReadStream) {
    return new Promise((resolve) => {
      const writable = fs.createWriteStream(`./upload/${fileName}`)

      readStream.pipe(writable).on('finish', () => {
        resolve(`/upload/${fileName}`)
      })
    })
  }
}
