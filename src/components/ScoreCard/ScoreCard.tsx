import cn from 'classnames'

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

export const ScoreCard = ({
  fieldName,
  fieldValue,
  mainCard = false,
  styles,
}: ScoreCardType) => {
  return (
    <div
      className={cn(
        'flex flex-col px-4 rounded-xl py-2 font-bold border-2 border-[#E9E7D9] items-center',
        mainCard ? 'bg-[#E9E7D9]' : 'bg-game',
        styles?.containerStyles
      )}
    >
      <span className={cn('text-[#988876]', styles?.fieldNameStyles)}>
        {fieldName}
      </span>

      <span className={cn('text-[#988876]', styles?.fieldValueStyles)}>
        {fieldValue}
      </span>
    </div>
  )
}
