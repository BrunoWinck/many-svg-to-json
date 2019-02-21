const fs = require ('fs');
const path = require('path');
const xml2js = require('xml2js');

// Outputs a JSON or JSX string 
module.exports = ( dir = '.', recursive = 'true', format ='jsx', extensions = ['.svg'], options = {}) => {
  // console.log( "many-vg-to-json", dir, recursive, format, extensions, options.dontConcatNames, options.makeArray);
  let icons = [];
  function ScanDir( dir1, prefix)
  {
    fs.readdirSync( dir1, { withFileTypes: true}).forEach( (dirEnt) => {
      if ( dirEnt.isDirectory())
      {
        if ( recursive)
        {
          ScanDir( path.join( dir1, dirEnt.name), options.dontConcatNames?"":prefix?prefix+"-"+dirEnt.name:dirEnt.name);
        }
      }
      else
      if ( dirEnt.isFile())
      {
        if ( typeof extensions.find( (ext) => ( ext == path.extname( dirEnt.name))) != "undefined")
        {
          let content = String( fs.readFileSync( path.join( dir1, dirEnt.name)));
          // #TODO: use svgr/svgo here ? At design time we don't need much optimization
          // Outside of xml and className React16 is pretty tolerant with svg
          let pos = content.search("<svg");
          if (pos == -1) 
          {
            console.error( "file ", path.join( dir1, dirEnt.name), "is not an svg file, tag <svg is missing");
          }
          else
          {
            content = content.substring( pos);
            content = content.replace( /class=/g, "className=");
            content = content.replace( /\<\!\-\-.*\-\-\>/g, "");
            content = content.replace( /\n *\n/g, "\n");

            let sName = dirEnt.name.substring( 0, dirEnt.name.length - path.extname( dirEnt.name).length);
            let name = prefix?prefix+"-"+sName:sName; 
            icons.push( { name: name, svg: content});
          }
        }
      }

    });
  }
  ScanDir( dir, "");
  if (( format == "jsx") || ( format == "tsx"))
  {
    let str = "";

    // this is to enable proper babel transform 
    if ( format == "tsx")
      str += `
import * as React from "react";
module.exports = {
`
    if ( options.makeArray)
      str += "[";
    else
      str += "{";
    str += "\n";

    str += icons.reduce( (strA, elt) => {
      if (strA)
        strA += ",\n";
      if ( options.makeArray)
        strA += `{ "name": "${elt.name}", "svg": ${elt.svg} }`;
      else
        strA += `"${elt.name}": ${elt.svg}`;
      return strA;
    }, "");

    str += "\n";
    if ( options.makeArray)
      str += "]";
    else
      str += "}";
    str += "\n";
    return str;
  }
  else
    if ( options.makeArray)
      return JSON.stringify( icons, null, "  ");
    else
    {
      let ret = icons.reduce( (strA, elt) => {
        strA[ elt.name] = String(elt.svg);
        return strA;
      }, {});
      return JSON.stringify( ret, null, "  ");
    }
}
