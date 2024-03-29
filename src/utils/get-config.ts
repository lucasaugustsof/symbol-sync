import { promises as fs, existsSync } from 'node:fs'
import path from 'node:path'

import chalk from 'chalk'

import { logger } from './logger'

export type ConfigProperties = {
  fileId: string
  categories: string[]
  entryDir: string
  outDir: string
}

export const configFileDir = path.join(process.cwd(), 'symbol-sync.json')

const requiredProperties = [
  'fileId',
  'categories',
  'entryDir',
  'outDir',
] as const

export async function getConfig(): Promise<ConfigProperties> {
  const isConfigFileExists = existsSync(configFileDir)

  if (!isConfigFileExists) {
    logger.error(`
      Error: Unable to locate the configuration file. Please check the root of your project to
      see if the ${chalk.white('symbol-sync.json')} file exists.
    `)
  }

  const rawFile = await fs.readFile(configFileDir, 'utf-8')
  const data = JSON.parse(rawFile) as ConfigProperties

  const propertiesNotFound: string[] = []

  for (const property of requiredProperties) {
    const propertyIndex = Object.keys(data).findIndex(
      (definedProperty) => definedProperty === property,
    )

    if (propertyIndex < 0) {
      propertiesNotFound.push(property)
      continue
    }
  }

  if (propertiesNotFound.length > 0) {
    logger.error(`
      Please ensure proper functionality by correctly setting the following properties
      in your configuration file: ${chalk.white(propertiesNotFound.join(','))}.
  `)
  }

  const isEntryDirExists = existsSync(data.entryDir)

  if (!isEntryDirExists) {
    await fs.mkdir(data.entryDir)
  }

  return data
}
