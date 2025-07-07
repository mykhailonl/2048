import React, { useCallback, useEffect, useRef } from 'react'

import type { Direction } from '../types/TileTypes.ts'

import { useGameContext } from './useGameContext.ts'
import { useModal } from './useModal.ts'

const MIN_SWIPE_DISTANCE = 50

const getSwipeDirection = (
  deltaX: number,
  deltaY: number
): Direction | null => {
  // checking min distance
  if (
    Math.abs(deltaX) < MIN_SWIPE_DISTANCE &&
    Math.abs(deltaY) < MIN_SWIPE_DISTANCE
  ) {
    return null
  }

  // determining direction based on delta
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? 'right' : 'left'
  } else {
    return deltaY > 0 ? 'down' : 'up'
  }
}

export const useSwipeControls = (
  elementRef: React.RefObject<HTMLElement | null>
) => {
  const { dispatch, state } = useGameContext()
  const { modalType } = useModal()
  const touchStartRef = useRef({ x: 0, y: 0 })

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return

    const touch = e.touches[0]

    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (modalType || state.status === 'win' || state.status === 'lose') return

      if (!e.changedTouches || e.changedTouches.length === 0) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      const direction = getSwipeDirection(deltaX, deltaY)

      if (direction) {
        dispatch({ type: 'QUEUE_COMMAND', direction })
      }
    },
    [dispatch, modalType, state.status]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (modalType) return

      e.preventDefault()
    },
    [modalType]
  )

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [elementRef, handleTouchStart, handleTouchEnd, handleTouchMove])
}
