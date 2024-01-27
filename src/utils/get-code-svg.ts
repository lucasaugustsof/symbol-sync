import { sendRequest } from './send-request'
import { logger } from './logger'

export async function getCodeSvg(url: string): Promise<string> {
  const { data, error } = await sendRequest<string>({
    base: url,
    config: {
      responseType: 'text',
    },
  })

  if (error) {
    logger.error(error.message!)
  }

  const codeWithoutXmlns = data.replace(/xmlns=".*?"/g, '')

  return codeWithoutXmlns
}
