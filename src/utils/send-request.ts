import path from 'node:path'

type HttpRequestOptions = {
  base: string
  endpoint?: string
  config?: RequestInit & {
    responseType?: 'text' | 'json'
    customErrorMessage?: string
  }
}

type HttpResponse<T> = {
  data: T
  error: HttpErrorResponse | null
}

type HttpErrorResponse = {
  statusCode?: number
  message?: string
}

/**
 * Makes an HTTP request to a specified URL
 *
 * This function abstracts the details of an HTTP request, making it easier to
 * perform calls to external or internal APIs. It can be adapted to support
 * different HTTP methods (GET, POST, etc.) and to handle request headers and bodies.
 */
export async function sendRequest<T>({
  base,
  endpoint,
  config,
}: HttpRequestOptions): Promise<HttpResponse<T>> {
  let data = null
  let error: HttpErrorResponse | null = null

  const response = await fetch(path.join(base, endpoint ?? ''), config)

  try {
    if (!response.ok) {
      throw Error(
        config?.customErrorMessage ?? `HTTP error status: ${response.status}`,
      )
    }

    data = await response[config?.responseType ?? 'json']()
  } catch (err) {
    error = {
      statusCode: response.status,
      message: err.message,
    }
  }

  return {
    data,
    error,
  }
}
