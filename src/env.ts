import 'dotenv/config'
import chalk from 'chalk'

import { logger } from '~/utils/logger'

type EnvironmentVariables = {
  FIGMA_ACCESS_TOKEN?: string
}

const environmentVariablesRequired = ['FIGMA_ACCESS_TOKEN'] as const
const _env: Record<string, string> = {}

for (const envKey of environmentVariablesRequired) {
  if (envKey in process.env) {
    _env[envKey] = process.env[envKey] as string
    continue
  }

  logger.error(`
    Error: The ${chalk.white(envKey)} environment variable is not set in your project.
    It is required to configure it for proper access to Figma functionalities.
  `)
}

export const env: EnvironmentVariables = _env
