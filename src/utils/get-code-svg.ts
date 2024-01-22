import axios from 'axios'

export async function getCodeSvg(url: string): Promise<string> {
  const code = await axios<string>(url, {
    responseType: 'text',
  })

  return code.data
}
