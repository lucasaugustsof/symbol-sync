import axios from 'axios'

export async function getCodeSvg(url: string) {
  const code = await axios(url, {
    responseType: 'text',
  })

  return code.data
}
