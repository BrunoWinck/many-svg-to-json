const fs = require ('fs');
const path = require('path');
const xml2js = require('xml2js');
const camelCase = require('camelcase');
 
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
            content = content.replace( / stop-color="/g, " stopColor=\"");
            content = content.replace( / stop-opacity="/g, " stopOpacity=\"");
            const svg_attrs = [
            "accent-height",
            "alignment-baseline",
            "baseline-shift",
            "cap-height",
            "color-interpolation-filters",
            "color-interpolation",
            "color-profile",
            "color-rendering",
            "dominant-baseline",
            "enable-background",
            "fill-opacity",
            "fill-rule",
            "flood-color",
            "flood-opacity",
            "font-family",
            "font-size-adjust",
            "font-size",
            "font-stretch",
            "font-style",
            "font-variant",
            "font-weight",
            "glyph-name",
            "glyph-orientation-horizontal",
            "glyph-orientation-vertical",
            "horiz-adv-x",
            "rendering-intent",
            "pointer-events",
            "panose-1",
            "overline-thickness",
            "overline-position",
            "marker-start",
            "marker-mid",
            "marker-end",
            "lighting-color",
            "letter-spacing",
            "image-rendering",
            "horiz-origin-x",
            "shape-rendering",
            "stop-color",
            "stop-opacity",
            "strikethrough-position",
            "strikethrough-thickness",
            "stroke-dasharray",
            "stroke-dashoffset",
            "stroke-linecap",
            "stroke-linejoin",
            "stroke-miterlimit",
            "stroke-opacity",
            "stroke-width",
            "text-anchor",
            "text-decoration",
            "text-rendering",
            "underline-position",
            "underline-thickness",
            "unicode-bidi",
            "unicode-range",
            "units-per-em",
            "v-alphabetic",
            "v-hanging",
            "v-ideographic",
            "v-mathematical",
            "vert-adv-y",
            "vert-origin-x",
            "vert-origin-y",
            "word-spacing",
            "writing-mode",
            "x-height"
            ];
            svg_attrs.forEach( (attr) => {
              let attr_jsx = camelCase( attr);
              // #TODO syntactically it could be any white caracter before the attribute, not only space
              content = content.replace( new RegExp( " " + attr + "=\"", "g"), " " + attr_jsx +"=\"");
            });
            svg_XML_attrs = [
              "xlink:actuate",
              "xlink:arcrole",
              "xlink:href",
              "xlink:role",
              "xlink:show",
              "xlink:title",
              "xlink:type",
              "xml:base",
              "xml:lang",
              "xml:space",
            ];
            svg_XML_attrs.forEach( (attr) => {
              let attr_jsx = camelCase( attr.replace( /:/g, "-"));
              // #TODO syntactically it could be any white caracter before the attribute, not only space
              content = content.replace( new RegExp( " " + attr + "=\"", "g"), " " + attr_jsx +"=\"");
            });


            /*
            cf https://reactjs.org/docs/dom-elements.html

            Similarly, all SVG attributes are fully supported:

            accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
            amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
            baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
            clip clipPath clipPathUnits clipRule colorInterpolation
            colorInterpolationFilters colorProfile colorRendering contentScriptType
            contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
            display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
            end exponent externalResourcesRequired fill fillOpacity fillRule filter
            filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
            fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
            g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
            gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
            imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
            kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
            limitingConeAngle local markerEnd markerHeight markerMid markerStart
            markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
            numOctaves offset opacity operator order orient orientation origin overflow
            overlinePosition overlineThickness paintOrder panose1 pathLength
            patternContentUnits patternTransform patternUnits pointerEvents points
            pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
            r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
            requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
            spacing specularConstant specularExponent speed spreadMethod startOffset
            stdDeviation stemh stemv stitchTiles stopColor stopOpacity
            strikethroughPosition strikethroughThickness string stroke strokeDasharray
            strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
            strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
            textDecoration textLength textRendering to transform u1 u2 underlinePosition
            underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
            vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
            vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
            writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
            xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
            xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
            */

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
