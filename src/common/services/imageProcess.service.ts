import { Injectable } from '@nestjs/common'
import * as sharp from 'sharp'

export interface IProcessConfig {
  resize: {
    width: number
    height?: number
    fit?: 'cover' | 'fill' | 'contain'
    position?: string
  }
  changeFormat?: keyof sharp.FormatEnum | sharp.AvailableFormatInfo
  rotate?: number
  isSharpen?: boolean
}

@Injectable()
export class ImageProcessService {
  createResizeTransformer(processConfig: IProcessConfig) {
    const sharpInstance = sharp()
    const { resize, changeFormat, rotate, isSharpen } = processConfig

    sharpInstance.resize(resize.width, resize.height, {
      fit: resize.fit || 'cover',
      position: resize.position || 'center',
    })

    if (changeFormat) {
      sharpInstance.toFormat(changeFormat)
    }

    if (rotate) {
      sharpInstance.rotate(rotate)
    }

    if (isSharpen) {
      sharpInstance.sharpen()
    }

    return sharpInstance
  }
}
