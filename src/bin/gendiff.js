#!/usr/bin/env node
import program from 'commander';
import { version, description } from '../../package.json';
import genDiff from '../genDiff';

program
  .version(version)
  .description(description)
  .option('-f, --format [type]', 'output format', 'plain')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    console.log(genDiff(firstConfig, secondConfig));
  })
  .parse(process.argv);
