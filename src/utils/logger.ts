import chalk from 'chalk'

export const logger = {
  error(log: string) {
    console.log(chalk.red(log))
  },
  warning(log: string) {
    console.log(chalk.yellow(log))
  },
  success(log: string) {
    console.log(chalk.green(log))
  },
}
