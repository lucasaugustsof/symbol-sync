import chalk from 'chalk'

export const logger = {
  error(log: string) {
    console.log(chalk.red(log))
    process.exit(0)
  },
  warning(log: string) {
    console.log(chalk.yellow(log))
  },
  success(log: string) {
    console.log(chalk.green(log))
  },
}
