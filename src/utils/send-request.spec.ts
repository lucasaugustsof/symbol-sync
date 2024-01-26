import { describe, it, expect } from 'vitest'

import { sendRequest } from './send-request'

const base = 'https://httpbin.org'

describe('utils / send-request', () => {
  it('should return all data brought via HTTP request', async () => {
    const { data } = await sendRequest({
      base,
      endpoint: '/json',
    })

    expect(data).haveOwnPropertyDescriptor('slideshow')
  })

  it('should return the request error message and statusCode', async () => {
    const { error } = await sendRequest({
      base,
      endpoint: `/status/404`,
    })

    expect(error?.statusCode).toEqual(404)
  })

  it('should return a customized message for HTTP request error', async () => {
    const errorReason = 'Internal server error'

    const { error } = await sendRequest({
      base,
      endpoint: `/status/404`,
      config: {
        customErrorMessage: errorReason,
      },
    })

    expect(error?.message).toBe(errorReason)
  })

  it('should return the response type in text format', async () => {
    const { data } = await sendRequest({
      base,
      endpoint: '/html',
      config: {
        responseType: 'text',
      },
    })

    expect(data).toBeTypeOf('string')
  })
})
