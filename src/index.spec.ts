import { describe, it, expect } from 'vitest'

import { sum } from '.'

describe('Example description', () => {
  it('should return 4 in the sum', () => {
    const result = sum(2, 2)
    expect(result)
  })
})
