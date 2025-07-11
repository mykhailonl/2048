import React from 'react'

export const GameInstructions = React.memo(() => {
  return (
    <div className="text-center">
      <p className="text-[#988876] text-sm font-medium max-w-lg mx-auto leading-relaxed">
        🎯 Use arrow keys to move tiles • Merge same numbers • Reach 2048 to
        win!
      </p>
    </div>
  )
})

GameInstructions.displayName = 'GameInstructions'
