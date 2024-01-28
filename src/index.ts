#!/usr/bin/env node

import 'dotenv/config'

import { Command } from 'commander'

import { name, description, version } from '../package.json'

import { runCommand } from '~/commands/run'

const program = new Command()
  .name(name)
  .description(description)
  .version(version)

function main() {
  program.addCommand(runCommand)
  program.parse(process.argv)
}

main()
