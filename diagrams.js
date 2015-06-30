/* jshint node: true, esnext: true*/
'use strict';

var Promise   = require('bluebird'),
program       = require('commander'),
path          = require('path'),
wsd           = Promise.promisifyAll(require('websequencediagrams')),
fs            = Promise.promisifyAll(require('fs')),
config        = require('./config'),
output = {
  'style':  { 'user':'', 'default': 'earth', 'all': ['earth', 'napkin'] },
  'format': { 'user':'', 'default': 'png', 'all': ['png'] },
};


let DEBUG = true;
let nr = 1 ; 

var createDiagram = Promise.coroutine(function* createDiagram(file) {
  try {
    let content = yield fs.readFileAsync('data/'+file, 'utf-8');
    let buf = yield wsd.diagramAsync(content, config.style, config.format);
    console.log(buf);
    yield fs.writeFileAsync('data/'+file.slice(0, file.length - '.wsd'.length)+'.png', buf[0]);
  } catch(err) {
    console.log(err);
  }
});

var sourceFilesInFolder = Promise.coroutine(function* sourceFilesInFolder(folder) {
    let files = yield fs.readdirAsync(folder);
    files.map(function(file) {
      if(path.extname(file) === 'wsd') return file;
    });
});

Promise.coroutine(function* run() {
  program
    .version('0.0.1')
    .option('-od --output-dir', 'select specific output directory')
    .option('-s --style', 'select a style for the diagram. Available styles are: napkin, earth. Default: earth')
    .option('-f --format', 'select a file format for the output image. Possible file types are: png. Default: png');

  program.parse(process.argv);

  if(program.args.length === 0) {
    run();
  } else {
    output.style.user = (program.args.style)? program.args.style: output.style.default;
    output.format.user = (program.args.format)? program.args.format: output.format.default;
  }

  let folder = 'data/';
  let files = yield fs.readFileAsync(folder);
  files.map(function(file) {
    if(path.extname(file) === 'wsd') return file;
  });

})();





