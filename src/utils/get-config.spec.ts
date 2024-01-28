// import { promises as fs } from 'node:fs'
// import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

// import { getConfig, configFileDir } from './get-config'

// const errorReason = 'process closed'

// async function removeGeneratedFiles() {
//   const files = [configFileDir, 'entryDir', 'outDir']

//   files.forEach(async (file) => {
//     await fs.rm(file, {
//       force: true,
//     })
//   })
// }

// beforeAll(async () => {
//   process.exit = vi.fn(() => {
//     throw errorReason
//   })

//   vi.spyOn(console, 'log').mockImplementation(() => {})

//   await removeGeneratedFiles()
// })

// afterAll(async () => {
//   await removeGeneratedFiles()
// })

// describe('utils / get-config', () => {
//   it('should return an error when the config file does not exist', async () => {
//     try {
//       await getConfig()
//     } catch (err) {
//       expect(err).toBe(errorReason)
//     }
//   })

//   it('should return an error if the config file exists but required properties are missing', async () => {
//     await fs.writeFile(
//       configFileDir,
//       JSON.stringify({
//         fileId: '...',
//       }),
//     )

//     try {
//       await getConfig()
//     } catch (err) {
//       expect(err).toBe(errorReason)
//     }
//   })

//   it('should return all properties available in the config file', async () => {
//     const data = {
//       fileId: '...',
//       categories: ['category1', 'category2'],
//       entryDir: 'entryDir',
//       outDir: 'outDir',
//     }

//     await fs.writeFile(configFileDir, JSON.stringify(data))

//     const config = await getConfig()

//     expect(config).toEqual(data)
//   })
// })
