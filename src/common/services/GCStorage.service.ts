/* eslint-disable newline-per-chained-call */
import { ReadStream } from 'typeorm/platform/PlatformTools'
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Bucket, Storage } from '@google-cloud/storage'
import { ConfigService } from '@nestjs/config'
import { EnvVariable } from '../interfaces/EnvVariable.interface'
import { ImageProcessService, IProcessConfig } from './imageProcess.service'

export enum StorageFolder {
  instructor = 'Instructors',
  course = 'Courses',
  ClientUsers = 'ClientUsers',
  documents = 'document',
}

@Injectable()
export class GCStorageService {
  private bucket: Bucket

  private rootFolder: string

  constructor(
    private configService: ConfigService<EnvVariable>,
    private imageProcessService: ImageProcessService
  ) {
    const storage = new Storage()
    this.bucket = storage.bucket('schoolx-dev-storage')
    this.rootFolder = this.configService.get('STORAGE_FOLDER')
  }

  async getFiles() {
    return this.bucket.getFiles()
  }

  /**
   * @additionalPath format: path/.../path
   */
  async uploadFile(config: {
    fileName: string
    readStream: ReadStream
    type: StorageFolder
    makePublic: boolean
    additionalPath?: string
    imageProcessConfig?: IProcessConfig
  }): Promise<{ publicUrl: string; filePath: string }> {
    const {
      fileName,
      readStream,
      type,
      makePublic,
      additionalPath,
      imageProcessConfig,
    } = config

    return new Promise((resolve) => {
      const filePath = additionalPath
        ? `${
            this.rootFolder
          }/${type}/${additionalPath}/${this.makeFileNameUnique(fileName)}`
        : `${this.rootFolder}/${type}/${this.makeFileNameUnique(fileName)}`

      const cloudFile = this.bucket.file(filePath)
      const transformedStream = this.addProcessImageToStream(
        imageProcessConfig,
        readStream
      )

      transformedStream
        .pipe(cloudFile.createWriteStream())
        .on('error', (err) => {
          throw new InternalServerErrorException(err)
        })
        .on('finish', async () => {
          if (makePublic) {
            try {
              await cloudFile.makePublic()
            } catch (err) {
              throw new InternalServerErrorException(err)
            }
          }
          resolve({
            publicUrl: cloudFile.publicUrl(),
            filePath,
          })
        })
    })
  }

  async deleteFile(filePath: string) {
    const cloudFile = this.bucket.file(filePath)

    try {
      await cloudFile.delete()

      return true
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  async getAllFileNames(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.bucket.getFiles(
        {
          prefix: this.rootFolder,
        },
        (err, files) => {
          if (err) {
            reject(err)

            return
          }

          resolve(files.map((item) => item.metadata.name))
        }
      )
    })
  }

  private addProcessImageToStream(
    processConfig: IProcessConfig,
    stream: ReadStream
  ) {
    if (processConfig) {
      const transformer =
        this.imageProcessService.createResizeTransformer(processConfig)

      return stream.pipe(transformer)
    }

    return stream
  }

  private makeFileNameUnique(fileName: string) {
    const fileNameArr = fileName.split('.')
    if (fileNameArr.length !== 2) {
      throw new InternalServerErrorException(
        'File name should be like "image.jpg")'
      )
    }
    const randomNumber = Math.random().toString(24).slice(2, 15)

    return `${fileNameArr[0]}-${randomNumber}.${fileNameArr[1]}`
  }
}
