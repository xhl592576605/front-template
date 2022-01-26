const sass = require('sass');
const { readFileSync } = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

function transformsass (sassFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedSassFile = path.resolve(cwd, sassFile);

  let data = readFileSync(resolvedSassFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');

  return sass.compileStringAsync(data)
    .then(result => postcss([autoprefixer]).process(result.css, { from: undefined }))
    .then(r => {
      return r.css;
    });
  // Do sass compile
  // const sassOpts = {
  //   paths: [path.dirname(resolvedsassFile)],
  //   filename: resolvedsassFile,
  //   plugins: [new NpmImportPlugin({ prefix: '~' })],
  //   javascriptEnabled: true,
  // };
  // return sass
  //   .render(data, sassOpts)
  //   .then(result => postcss([autoprefixer]).process(result.css, { from: undefined }))
  //   .then(r => {
  //     return r.css;
  //   });
}

module.exports = transformsass;
