import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class')
    expect(result).toContain('base-class')
    expect(result).toContain('conditional-class')
  })

  it('should filter out falsy values', () => {
    const result = cn('base-class', false && 'never-included', null, undefined)
    expect(result).toBe('base-class')
  })

  it('should merge Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })
})
