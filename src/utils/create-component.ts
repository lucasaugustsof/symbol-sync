import { promises as fs } from 'node:fs'
import path from 'node:path'

import { getCreatedComponentFiles } from './get-created-component-files'
import { transformJSX } from './transform-jsx'

type Component = {
  name: string
  code: string
}

export async function createComponent(entry: string, component: Component) {
  const componentsAlreadyCreated = await getCreatedComponentFiles(entry)

  if (componentsAlreadyCreated.includes(component.name)) {
    return
  }

  const componentDir = path.join(entry, `${component.name}.tsx`)

  await fs.writeFile(componentDir, transformJSX(component.name, component.code))
}
