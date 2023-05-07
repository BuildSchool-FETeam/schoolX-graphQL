/* eslint-disable @typescript-eslint/no-explicit-any*/
import 'src/common/services/__tests__/mocks/JimpMock'
import { ImageProcessService, IProcessConfig } from '../imageProcess.service'
import * as fs from 'fs'
import { Readable } from 'stream'
import { ReadStream } from 'typeorm/platform/PlatformTools'
import { JimpMock } from 'src/common/services/__tests__/mocks/JimpMock'

describe('ImageProcessService', () => {
  let service: ImageProcessService
  let stream: ReadStream

  describe('processing image', () => {
    let processConfig: IProcessConfig

    service = new ImageProcessService()
    beforeEach(() => {
      processConfig = {
        resize: {
          width: 100,
        },
      }

      stream = fs.createReadStream(
        'src/common/services/__tests__/mocks/test.jpg'
      )

      jest.spyOn(Readable, 'from').mockImplementation((img) => img as any)
    })

    it('should work as expect if config with resize and sharpen', async () => {
      const listMethodCalled = (await service.processImage(
        stream,
        processConfig
      )) as unknown as JimpMock

      expect(listMethodCalled).toEqual(['getMime', 'cover', 'resize'])
    })

    it('should work as expect if config with resize and rotate', async () => {
      processConfig = {
        resize: {
          width: 100,
        },
        rotate: 120,
        blur: 2,
        opacity: 0.1,
      }

      const result = (await service.processImage(
        stream,
        processConfig
      )) as unknown as JimpMock

      expect(result).toEqual([
        'getMime',
        'cover',
        'resize',
        'rotate',
        'opacity',
        'blur',
      ])
    })
  })
})
