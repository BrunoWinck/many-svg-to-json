#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const commander = require('commander');
const fct = require('./index.js');

commander
  .version('0.0.1')
  .usage('[options] <file ...>')
  ;

commander
  .arguments('[path]')
  .option( '--extensions <extensions>', 'extensions for svg files', ".svg")
  .option( '--format <format>', 'format of output', "tsx")
  .option( '-o --out <output>', 'path of output', "icons")
	.option( '-r --recursive', 'recursive', true)
	.option( '-w --watch', 'watch and update output for every change', false)
  .action( async function ( path1) {
    try
    {
      let inputDirectoryPath = path1 || ".";
      let outputPath = commander.out || "icons";
      if ( path.extname( outputPath) == "")
      {
        outputPath += "." + commander.format;
      }
      const extensions = commander.extensions.split( ",|");
      let options = {};
      const output = fct( inputDirectoryPath, commander.recursive, commander.format, extensions, options );
      fs.writeFileSync( outputPath, output);
      if ( commander.watch)
      {
        console.log("Not yet implemented. Would option -watch be useful? let us know");
        // fs.watch(filename[, options][, listener])
      }
    }
    catch (e)
    {
      console.error( "unknown error, please report", e);
    }
  });

  commander
  .parse( process.argv)
  ;

