import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function getCreatedComponentFiles(dir: string) {
  let createdComponentFiles = await fs.readdir(dir)

  createdComponentFiles = createdComponentFiles.map((componentName) => {
    return path.parse(componentName).name
  })

  return createdComponentFiles
}
