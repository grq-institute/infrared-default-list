import { existsSync } from 'node:fs'
import path from 'path'

import type { TokensSchema } from '@/types/tokens'

import { checkImageSize } from './check-image-size'
import { ASSETS_FOLDER } from './constants'

export const validateImage = async ({
  errors,
  item,
  required,
  type,
}: {
  errors: Array<string>
  item: TokensSchema['tokens'][number]
  required: boolean
  type: string
}) => {
  if (!item.image) {
    if (required) {
      errors.push(
        `Image file "${item.image}" not found for ${type} "${item.symbol}"`,
      )
    }
    return
  }
  const imagePath = path.join(`${ASSETS_FOLDER}/${type}`, item.image)
  if (path.extname(imagePath).toLowerCase() === '.png') {
    errors.push(
      `Image file "${item.image}" for ${type} "${item.symbol}" should be a webp file, not a png`,
    )
  }
  if (!existsSync(imagePath)) {
    errors.push(
      `Image file "${item.image}" not found for ${type} "${item.symbol}" at ${imagePath}`,
    )
  }
  if (path.extname(imagePath).toLowerCase() === '.webp') {
    const isCorrectSize = await checkImageSize(imagePath)
    if (!isCorrectSize) {
      errors.push(
        `Image file "${item.image}" for ${type} "${item.symbol}" is not 128x128 pixels`,
      )
    }
    const pngImagePath = path.join(
      `${ASSETS_FOLDER}/${type}/original`,
      item.image.replace('.webp', '.png'),
    )
    if (!existsSync(pngImagePath)) {
      errors.push(
        `Image file "${item.image}" for ${type} "${item.symbol}" does not have an original png file`,
      )
    }
  }
}
