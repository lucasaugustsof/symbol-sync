import { promises as fs } from 'node:fs'
import path from 'node:path'

import { build, Options } from 'tsup'

import { getCreatedComponentFiles } from './get-created-component-files'

export async function libBuilder(entry: string, options?: Options) {
  try {
    const createdComponentFiles = await getCreatedComponentFiles(entry)
    const indexFile = path.join(entry, 'index.ts')

    let indexFileContent = ''

    for (const componentFile of createdComponentFiles) {
      const newRow = `export * from './${componentFile}'\n`

      if (!indexFileContent.includes(newRow) && componentFile !== 'index') {
        await fs.appendFile(indexFile, newRow)

        indexFileContent = await fs.readFile(indexFile, 'utf8')
        continue
      }
    }

    await build({
      entry: [indexFile],
      format: ['cjs', 'esm'],
      external: ['react'],
      dts: true,
      silent: true,
      ...options,
    })
    // Successful feedback here
  } catch (error) {
    // Error feedback here
  }
}
