"use client"

import { useState, useCallback } from "react"

interface ValidationRules {
  [key: string]: (value: string) => string | null
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationRules,
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setFieldTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const setValue = useCallback(
    (field: keyof T, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }))

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  const setTouched = useCallback((field: keyof T) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }))
  }, [])

  const validateField = useCallback(
    (field: keyof T, value: string) => {
      const rule = validationRules[field as string]
      return rule ? rule(value) : null
    },
    [validationRules],
  )

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(values).forEach((field) => {
      const error = validateField(field as keyof T, values[field as keyof T])
      if (error) {
        newErrors[field as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validateField])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setFieldTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateField,
    validateAll,
    reset,
  }
}
