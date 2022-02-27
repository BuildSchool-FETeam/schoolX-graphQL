import 'src/common/services/__tests__/mocks/SharpMock.ts'
import { ImageProcessService, IProcessConfig } from '../imageProcess.service'

describe('ImageProcessService', () => {
  let service: ImageProcessService

  beforeAll(() => {
    service = new ImageProcessService()
  })

  describe('createResizeTransformer', () => {
    let processConfig: IProcessConfig

    beforeEach(() => {
      processConfig = {
        resize: {
          width: 100,
        },
        isSharpen: true,
      }
    })

    it('should work as expect if config with resize and sharpen', () => {
      const result = service.createResizeTransformer(
        processConfig
      ) as unknown as SharpMock

      expect(result.methodCalled).toEqual(['resize', 'sharpen'])
    })

    it('should work as expect if config with resize and rotate', () => {
      processConfig = {
        resize: {
          width: 100,
        },
        rotate: 120,
      }

      const result = service.createResizeTransformer(
        processConfig
      ) as unknown as SharpMock

      expect(result.methodCalled).toEqual(['resize', 'rotate'])
    })

    it('should work as expect if config with full options', () => {
      processConfig = {
        resize: {
          width: 100,
        },
        rotate: 120,
        changeFormat: 'avif',
        isSharpen: true,
      }

      const result = service.createResizeTransformer(
        processConfig
      ) as unknown as SharpMock

      expect(result.methodCalled).toEqual([
        'resize',
        'toFormat',
        'rotate',
        'sharpen',
      ])
    })
  })
})
