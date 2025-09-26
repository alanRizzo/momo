"use client"

import { useState, useCallback } from "react"

export function useEditableField<T>(initialValue: T) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(initialValue)

  const startEditing = useCallback(() => {
    setTempValue(initialValue)
    setIsEditing(true)
  }, [initialValue])

  const cancelEditing = useCallback(() => {
    setTempValue(initialValue)
    setIsEditing(false)
  }, [initialValue])

  const confirmEdit = useCallback(
    (onSave?: (value: T) => Promise<void> | void) => {
      return async () => {
        try {
          if (onSave) {
            await onSave(tempValue)
          }
          setIsEditing(false)
        } catch (error) {
          console.error("Error saving field:", error)
          throw error
        }
      }
    },
    [tempValue],
  )

  return {
    isEditing,
    tempValue,
    setTempValue,
    startEditing,
    cancelEditing,
    confirmEdit,
  }
}
