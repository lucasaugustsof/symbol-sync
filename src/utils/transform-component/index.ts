import { transform, Config } from '@svgr/core'
import camelcase from 'camelcase'

import { reactTemplate } from './templates'

export function transformComponent(_componentName: string, svgCode: string) {
  const componentName = camelcase(_componentName, {
    pascalCase: true,
  })

  const essentialProperties: Config = {
    icon: true,
    typescript: true,
    ref: true,
    replaceAttrValues: {
      '#000': '{color}',
      '1em': '{sizeMapper[size] ?? sizeMapper.default}',
    },
  }

  const code = transform.sync(
    svgCode,
    {
      plugins: [
        '@svgr/plugin-svgo',
        '@svgr/plugin-jsx',
        '@svgr/plugin-prettier',
      ],

      exportType: 'named',
      namedExport: componentName,
      template: reactTemplate,
      ...essentialProperties,
    },
    {
      componentName,
    },
  )

  const codeWithoutXmlns = code.replace(/xmlns=".*?"/g, '')

  return codeWithoutXmlns
}
