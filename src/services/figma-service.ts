import axios from 'axios'

import { Figma } from '~/models/figma'

export class FigmaService {
  private API = axios.create({
    baseURL: 'https://api.figma.com/v1',
  })

  private _documentId: string = ''

  constructor() {
    this.API.interceptors.request.use((config) => {
      config.headers['X-Figma-Token'] = String(process.env.FIGMA_ACCESS_TOKEN)

      return config
    })
  }

  async retrieveCloudDocumentData(documentId: string) {
    try {
      this._documentId = documentId

      const response = await this.API.get<Record<'document', Figma.Document>>(
        `/files/${documentId}`,
      )
      const { document } = response.data

      return document
    } catch (err) {
      throw new Error(err)
    }
  }

  async retrieveCloudImageInfo(identifiers: string[]) {
    try {
      const ids = identifiers.join(',')

      const response = await this.API.get<Figma.Image>(
        `/images/${this._documentId}?ids=${ids}&format=svg`,
      )

      const { images } = response.data

      return images
    } catch (err) {
      throw new Error(err)
    }
  }
}
