import { transform, Config } from '@svgr/core'
import camelcase from 'camelcase'

import { reactTemplate } from './templates'

export function transformJSX(_componentName: string, svgCode: string) {
  const componentName = camelcase(_componentName + '-icon', {
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

  return code
}
