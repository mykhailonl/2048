import React, { useState } from 'react'

export type TooltipProps = {
  children: React.ReactNode
  tooltip?: {
    elementName: string
    usesLeft?: number
    status?: string
    description: string
  }
}

export const Tooltip = ({ children, tooltip }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 bg-game border-2 border-board rounded-lg shadow-lg px-3 py-2 text-sm whitespace-nowrap">
          <div className="flex flex-col gap-1 text-center">
            <div className="flex gap-1 justify-between">
              <span className="font-semibold text-gray-700">
                {tooltip.elementName.toUpperCase()}
              </span>

              {tooltip.usesLeft && (
                <span className="text-gray-600">
                  {tooltip.usesLeft} {tooltip.usesLeft === 1 ? 'use' : 'uses'}{' '}
                  left
                </span>
              )}

              {tooltip.status && (
                <span className="text-gray-600">
                  Currently {tooltip.status}
                </span>
              )}
            </div>

            <p className="text-gray-500 text-xs">{tooltip.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}
