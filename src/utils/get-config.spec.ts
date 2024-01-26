import { promises as fs } from 'node:fs'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

import { getConfig, configFileDir } from './get-config'

const errorReason = 'process closed'

async function removeConfigFile() {
  await fs.rm(configFileDir, {
    force: true,
  })
}

beforeAll(async () => {
  process.exit = vi.fn(() => {
    throw errorReason
  })

  vi.spyOn(console, 'log').mockImplementation(() => {})

  await removeConfigFile()
})

afterAll(async () => {
  await removeConfigFile()
})

describe('utils / get-config', () => {
  it('should return an error when the config file does not exist', async () => {
    try {
      await getConfig()
    } catch (err) {
      expect(err).toBe(errorReason)
    }
  })

  it('should return an error if the config file exists but required properties are missing', async () => {
    await fs.writeFile(
      configFileDir,
      JSON.stringify({
        fileId: '...',
      }),
    )

    try {
      await getConfig()
    } catch (err) {
      expect(err).toBe(errorReason)
    }
  })

  it('should return all properties available in the config file', async () => {
    const data = {
      fileId: '...',
      categories: ['category1', 'category2'],
    }

    await fs.writeFile(configFileDir, JSON.stringify(data))

    const config = await getConfig()

    expect(config).toEqual(data)
  })
})
