import { Command } from 'commander'
import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'

import { FigmaService } from '~/services/figma-service'

import { APP_NAME } from '~/utils/const'
import { createComponent } from '~/utils/create-component'
import { getConfig, type ConfigProperties } from '~/utils/get-config'
import { getMappedIcons } from '~/utils/get-mapped-icons'
import { libBuilder } from '~/utils/lib-builder'
import { logger } from '~/utils/logger'

type CommandOpts = {
  build: boolean
}

type CategoryData = {
  id: string
  name: string
  code?: string
}

const figmaService = new FigmaService()

class RunCommand extends Command {
  private config: ConfigProperties = {
    fileId: '',
    categories: [],
    entryDir: '',
    outDir: '',
  }

  constructor() {
    super()

    this.name('run')
    this.description('Command to sync icons')

    this.option('--build', 'option to create React icon library')

    this.action((opts: CommandOpts) => this.execute(opts))
  }

  async execute(opts: CommandOpts) {
    this.config = await getConfig()

    const loadingFigmaData = ora(
      'Loading data from Figma, please wait...',
    ).start()

    const figmaDocument = await figmaService.retrieveCloudDocumentData(
      this.config.fileId,
    )

    loadingFigmaData.succeed('Figma data loaded successfully!')

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

        if (
          category.type === 'FRAME' &&
          this.config.categories.includes(categoryName)
        ) {
          return category
        }

        return null
      })
      .filter(Boolean)

    if (!categoriesWithIcons.length) {
      logger.error(`
        Error: The icon categories specified in the settings were not found.
        Please check if the names of the categories are correct and try again.
      `)
    }

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

    const { nameSelectedCategory } = await prompts({
      type: 'select',
      name: 'nameSelectedCategory',
      message: 'What category of icons would you like to synchronize?',
      choices: Object.keys(categoryData).map((category) => {
        return {
          title: category,
          value: category,
        }
      }),
    })

    if (!nameSelectedCategory) {
      process.exit(0)
    }

    const loadingSyncingSelectedCategoryIcons = ora(
      'Loading and syncing icons from selected category, please wait...',
    ).start()

    categoryData[nameSelectedCategory] = await this.saveIconToCategory(
      categoryData[nameSelectedCategory],
    )

    await this.createIconsForSelectedCategory(
      categoryData[nameSelectedCategory],
    )

    loadingSyncingSelectedCategoryIcons.succeed(
      `Category ${nameSelectedCategory} icons successfully uploaded and synced!`,
    )

    if (opts.build) {
      await libBuilder(this.config.entryDir, {
        outDir: this.config.outDir,
      })
    }
  }

  async saveIconToCategory(category: CategoryData[]) {
    const categoryIconIdentifiers = category.map(({ id }) => id)

    const iconUrlMappings = await figmaService.retrieveCloudImageInfo(
      categoryIconIdentifiers,
    )

    const mappedIcons = await getMappedIcons(iconUrlMappings)

    return category.map(({ id, name }) => {
      return {
        id,
        name,
        code: mappedIcons[id],
      }
    })
  }

  async createIconsForSelectedCategory(category: CategoryData[]) {
    for await (const icon of category) {
      await createComponent(this.config.entryDir, {
        name: icon.name,
        code: icon.code!,
      })
    }
  }
}

export const runCommand = new RunCommand()
