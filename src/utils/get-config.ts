import { promises as fs, existsSync } from 'node:fs'
import path from 'node:path'

import chalk from 'chalk'

import { logger } from './logger'

type ConfigProperties = {
  fileId: string
  categories: Array<string>
}

const configFileDir = path.join(process.cwd(), 'symbol-sync.json')

export async function getConfig(): Promise<ConfigProperties> {
  const isConfigFileExists = existsSync(configFileDir)

  if (!isConfigFileExists) {
    logger.error(`
      Unable to locate the configuration file. Please check the root of your project to
      see if the ${chalk.white('symbol-sync.json')} file exists.
    `)
    process.exit(0)
  }

  const rawFile = await fs.readFile(configFileDir, 'utf-8')
  const data = JSON.parse(rawFile) as ConfigProperties

  return data
}
