import cn from 'classnames'
import React from 'react'

type ScoreCardType = {
  fieldName: string
  fieldValue: number
  mainCard?: boolean
  styles?: {
    containerStyles?: string
    fieldNameStyles?: string
    fieldValueStyles?: string
  }
}

export const ScoreCard = React.memo(
  ({ fieldName, fieldValue, mainCard = false, styles }: ScoreCardType) => {
    return (
      <div
        className={cn(
          'flex px-4 rounded-xl py-2 border-2 border-[#E9E7D9] items-center md:flex-col justify-between grow md:grow-0',
          mainCard ? 'bg-[#E9E7D9]' : 'bg-game',
          styles?.containerStyles
        )}
        aria-label={`${mainCard ? 'Current' : 'Best'} score: ${fieldValue}`}
      >
        <p className={cn('text-[#988876]', styles?.fieldNameStyles)}>
          {fieldName}
        </p>

        <p className={cn('text-[#988876] font-bold', styles?.fieldValueStyles)}>
          {fieldValue}
        </p>
      </div>
    )
  }
)

ScoreCard.displayName = 'ScoreCard'
