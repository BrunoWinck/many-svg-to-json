# many-svg-to-json
Helping script to turn a directory of svg files into a stand alone json

Goal: Make it easy to build icon library components from many svg files.

Collect all svg files in a given directory and sub-directories and turn them into a single JSON or JSX file.

Can be used as a module, with an API, or as a script with a command line interface.

Arguments
---------
- directory to search for for svg files, default : .
- recursive true/false, default: true
- format: json or jsx, default: jsx
- output, path to resulting file, default icons.json or icons.jsx
- extensions for svg files, default: svg

Help
----
many-svg-to-json --help
Usage: many-svg-to-json [options] <file ...>

Options:
  -V, --version              output the version number
  --extensions <extensions>  extensions for svg files (default: ".svg")
  --format <format>          format of output (default: "tsx"), or json, jsx
  -o --out <output>          path of output (default: "icons")
  -r --recursive             recursive
  -w --watch                 watch and update output for every change (not yet implemented)
  -h, --help                 output usage information

Install
-------
npm install -g many-svg-to-json

with the -g option, the script will be installed globally and can be called by it's name only.

Run
many-svg-to-json <path-to-directory> [options]
or
cd <path-to-directory> [options]

Example
To build the example
npm start example -- --out example/icons.framerfx/data/icons && cat example/icons.framerfx/data/icons.tsx

Tip
You integrate the script in your install script in the package.json of your component
