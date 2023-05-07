import { Injectable } from '@nestjs/common'
import { ReadStream } from 'fs'
import * as Jimp from 'jimp'
import { Readable } from 'stream'

export interface IProcessConfig {
  resize: {
    width: number
    height?: number
    position?: ImagePos
  }
  rotate?: number
  opacity?: number
  blur?: number
}

type ImagePos = 'top' | 'bottom' | 'center'
@Injectable()
export class ImageProcessService {
  async processImage(
    stream: ReadStream,
    { resize, rotate, opacity, blur }: IProcessConfig
  ) {
    const { width, height = width * 0.6, position = 'center' } = resize
    const buffs: unknown[] = []

    return new Promise<Readable>((resolve, reject) => {
      stream.on('data', (dt) => {
        buffs.push(dt)
      })

      stream.on('end', async () => {
        const fullBuffer = Buffer.concat(buffs as Buffer[])
        try {
          let jimpFile = await Jimp.read(fullBuffer)
          const mimeType = jimpFile.getMIME()

          jimpFile = jimpFile.cover(width, height, this.getJimpPos(position))
          jimpFile = jimpFile.resize(width, height)

          if (rotate) {
            jimpFile = jimpFile.rotate(rotate)
          }

          if (opacity) {
            jimpFile = jimpFile.opacity(opacity)
          }

          if (blur) {
            jimpFile = jimpFile.blur(blur)
          }

          jimpFile.getBuffer(mimeType, (err, img) => {
            if (err) reject(err)
            resolve(Readable.from(img))
          })
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  private getJimpPos(pos: ImagePos) {
    switch (pos) {
      case 'top':
        return Jimp.VERTICAL_ALIGN_TOP

      case 'center':
        return Jimp.VERTICAL_ALIGN_MIDDLE

      case 'bottom':
        return Jimp.VERTICAL_ALIGN_BOTTOM
      default:
        return Jimp.AUTO
    }
  }
}
