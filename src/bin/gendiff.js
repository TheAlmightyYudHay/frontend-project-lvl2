#!/usr/bin/env node
import fs from 'fs';
import program from 'commander';
import { version, description } from '../../package.json';
import genDiff from '../genDiff';

program
  .version(version)
  .description(description)
  .option('-f, --format [type]', 'output format', 'plain')
  .arguments('<firstConfig> <secondConfig>')
  .action((firstConfig, secondConfig) => {
    const firstFile = fs.readFileSync(firstConfig);
    const secondFile = fs.readFileSync(secondConfig);
    console.log(genDiff(firstFile, secondFile));
  })
  .parse(process.argv);
