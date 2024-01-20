import { getCodeSvg } from './get-code-svg'

export async function getMappedIcons(iconUrlMappings: Record<string, string>) {
  const mappedIcons = iconUrlMappings

  for (const iconUrl in iconUrlMappings) {
    Object.assign(mappedIcons, {
      [iconUrl]: await getCodeSvg(iconUrlMappings[iconUrl]),
    })
  }

  return mappedIcons
}
