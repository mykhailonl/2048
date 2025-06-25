import type { CellValue } from '../types/BoardTypes.ts'

const tileStylesMap = {
  2: 'bg-tile-2 text-tile-2 text-tile-lg',
  4: 'bg-tile-4 text-tile-4 text-tile-lg',
  8: 'bg-tile-8 text-tile-8 text-tile-lg',
  16: 'bg-tile-16 text-tile-16 text-tile-lg',
  32: 'bg-tile-32 text-tile-32 text-tile-lg',
  64: 'bg-tile-64 text-tile-64 text-tile-lg',
  128: 'bg-tile-128 text-tile-128 text-tile-md',
  256: 'bg-tile-256 text-tile-256 text-tile-md',
  512: 'bg-tile-512 text-tile-512 text-tile-md',
  1024: 'bg-tile-1024 text-tile-1024 text-tile-sm',
  2048: 'bg-tile-2048 text-tile-2048 text-tile-sm',
} as const

export const getTileStyle = (value: CellValue) => {
  if (!value) return 'bg-cell-empty'

  return (
    tileStylesMap[value as keyof typeof tileStylesMap] ||
    'bg-tile-2048 text-tile-2048 text-tile-sm'
  )
}
