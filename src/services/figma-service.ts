import { env } from '../env'

import { Figma } from '~/namespaces/figma'

import { sendRequest } from '~/utils/send-request'

export class FigmaService {
  private _baseUrl = 'https://api.figma.com/v1'
  private _headers = {
    'X-Figma-Token': env.FIGMA_ACCESS_TOKEN!,
  }

  private _documentId: string = ''

  async retrieveCloudDocumentData(documentId: string) {
    this._documentId = documentId

    const { data, error } = await sendRequest<
      Record<'document', Figma.Document>
    >({
      base: this._baseUrl,
      endpoint: `/files/${documentId}`,
      config: {
        headers: this._headers,
      },
    })

    if (error) {
      throw Error(error.message)
    }

    return data.document
  }

  async retrieveCloudImageInfo(identifiers: string[]) {
    const ids = identifiers.join(',')

    const { data, error } = await sendRequest<Figma.Image>({
      base: this._baseUrl,
      endpoint: `/images/${this._documentId}?ids=${ids}&format=svg`,
      config: {
        headers: this._headers,
      },
    })

    if (error) {
      throw Error(error.message)
    }

    return data.images
  }
}
