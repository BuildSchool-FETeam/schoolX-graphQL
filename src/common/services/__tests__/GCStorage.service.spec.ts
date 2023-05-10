/* eslint-disable @typescript-eslint/no-explicit-any */
import './mocks/GCMock'
import { file } from './mocks/GCMock'
import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import { ReadStream } from 'fs'
import { assertThrowError } from 'src/common/mock/customAssertion'
import { StreamMock } from 'src/common/mock/StreamMock'
import { GCStorageService, StorageFolder } from '../GCStorage.service'
import { ImageProcessService, IProcessConfig } from '../imageProcess.service'

const configService = {
  get() {
    return 'FOLDER'
  },
}

const imageService = {
  createResizeTransformer: jest.fn().mockReturnValue(() => new StreamMock()),
}

describe('GCStorageService', () => {
  let service: GCStorageService

  beforeAll(async () => {
    const testModule = Test.createTestingModule({
      providers: [GCStorageService, ConfigService, ImageProcessService],
    })

    testModule.overrideProvider(ConfigService).useValue(configService)
    testModule.overrideProvider(ImageProcessService).useValue(imageService)

    const module = await testModule.compile()

    service = module.get(GCStorageService)
  })

  describe('getFiles', () => {
    it('should get files', async () => {
      const result = await service.getFiles()

      expect(result).toEqual({})
    })
  })

  describe('uploadFile', () => {
    let config: {
      fileName: string
      readStream: ReadStream
      type: StorageFolder
      makePublic: boolean
      additionalPath?: string
      imageProcessConfig?: IProcessConfig
    } = null

    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.1)

      config = {
        fileName: 'file.jpg',
        readStream: new StreamMock() as any,
        type: StorageFolder.ClientUsers,
        makePublic: false,
      }
    })

    it('should return a file path after upload done', async () => {
      config.makePublic = true

      const result = await service.uploadFile(config)

      expect(result).toEqual({
        filePath: 'FOLDER/ClientUsers/file-29e9e9e9e9ea.jpg',
        publicUrl: 'public-url',
      })
    })
  })

  describe('deleteFile', () => {
    it('should throw error when delte failed', async () => {
      file.delete.mockImplementation(() => {
        throw new BadRequestException('Big Error')
      })
      await assertThrowError(
        service.deleteFile.bind(service, 'filePath'),
        new BadRequestException('Big Error')
      )

      file.delete.mockReset()
    })

    it('should delete the file successfully', async () => {
      const result = await service.deleteFile('string')

      expect(result).toBe(true)
    })
  })

  describe('getAllFileNames', () => {
    it('should get all the file name', async () => {
      const result = await service.getAllFileNames()

      expect(result).toEqual(['file1', 'file2'])
    })
  })
})
