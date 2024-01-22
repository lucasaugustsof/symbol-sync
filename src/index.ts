import 'dotenv/config'

import chalk from 'chalk'

import { FigmaService } from '~/services/figma-service'

import { getConfig } from '~/utils/get-config'
import { logger } from '~/utils/logger'
import { getMappedIcons } from '~/utils/get-mapped-icons'
import { APP_NAME } from '~/utils/const'

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

  const categoryData: Record<string, Array<CategoryData>> = {}

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

  console.log(categoryData)
}

main()
