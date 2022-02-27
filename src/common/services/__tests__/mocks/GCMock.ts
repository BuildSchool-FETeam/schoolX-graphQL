import { StreamMock } from 'src/common/mock/StreamMock'

export const file = {
  createReadStream: jest.fn(() => new StreamMock()),
  makePublic: jest.fn(),
  publicUrl: jest.fn().mockReturnValue('public-url'),
  createWriteStream: jest.fn(() => new StreamMock()),
  delete: jest.fn(),
}

export class BucketMock {
  getFiles(
    option: DynamicObject = {},
    cb?: (err: unknown, files: DynamicObject[]) => void
  ) {
    let error = null
    if (option.err === 'create error') {
      error = 'ERROR'
    }
    cb &&
      cb(error, [
        {
          metadata: {
            name: 'file1',
          },
        },
        {
          metadata: {
            name: 'file2',
          },
        },
      ])

    return {}
  }

  file() {
    return file
  }
}

export class StorageMock {
  bucket() {
    return new BucketMock()
  }
}

jest.mock('@google-cloud/storage', () => ({
  Storage: StorageMock,
}))
