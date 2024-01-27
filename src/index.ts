import 'dotenv/config'

import chalk from 'chalk'

import { FigmaService } from '~/services/figma-service'

import { APP_NAME } from '~/utils/const'
import { createComponent } from '~/utils/create-component'
import { getConfig } from '~/utils/get-config'
import { getMappedIcons } from '~/utils/get-mapped-icons'
import { libBuilder } from '~/utils/lib-builder'
import { logger } from '~/utils/logger'

interface CategoryData {
  id: string
  name: string
  code?: string
}

const figmaService = new FigmaService()

async function main() {
  const { fileId, categories } = await getConfig()

  const figmaDocument = await figmaService.retrieveCloudDocumentData(fileId)

  const symbolSyncPage = figmaDocument.children.find(
    (page) => page.name === APP_NAME,
  )

  if (!symbolSyncPage) {
    logger.error(
      `
      Error: The expected ${chalk.white(
        APP_NAME,
      )} page was not found in the Figma document.
      Please check if the page name is correct and if it exists in the current document.
      `,
    )

    return
  }

  const categoriesWithIcons = symbolSyncPage.children
    .filter((category) => {
      const categoryName = category.name.toLowerCase()

      if (categories.includes(categoryName)) {
        return category
      }

      return null
    })
    .filter(Boolean)

  const categoryData: Record<string, CategoryData[]> = {}

  for (const categoryFound of categoriesWithIcons) {
    const categoryName = categoryFound.name.toLowerCase()
    categoryData[categoryName] = []

    categoryFound.children.forEach(({ id, name }) => {
      categoryData[categoryName].push({
        id,
        name,
      })
    })
  }

  // TODO - Refactor code for better modularity by breaking down large functions into smaller, clearer units

  for (const category in categoryData) {
    const categoryIconIdentifiers = categoryData[category].map(({ id }) => id)

    const iconUrlMappings = await figmaService.retrieveCloudImageInfo(
      categoryIconIdentifiers,
    )

    const mappedIcons = await getMappedIcons(iconUrlMappings)

    categoryData[category] = categoryData[category].map(({ id, name }) => {
      return {
        id,
        name,
        code: mappedIcons[id],
      }
    })
  }

  // TODO - Leave this variable in the config file

  const entry = './src/components'

  // TODO - Refactor this function after CLI implementation

  for await (const icon of categoryData['attention']) {
    await createComponent(entry, {
      name: icon.name,
      code: icon.code!,
    })
  }

  await libBuilder(entry, {
    outDir: 'lib',
  })
}

main()
