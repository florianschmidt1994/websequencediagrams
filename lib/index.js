'use strict';

var Promise     = require('bluebird'),
    wsd     = Promise.promisifyAll(require('websequencediagrams')),
fs          = Promise.promisifyAll(require('fs')),
async       = require('async'),
config      = require('./config'),
program     = require('commander'),
_           = require('lodash');



function *main() {
    
    program
        .version('0.0.1')
        .usage('[options] <file or folder>')
        .option('-t, --theme <name>', 'Choose theme out of \'napkin\', \'earth\' (Defaults to napkin)')
        .parse(process.argv);

    if(program.theme && !(_.contains(['napkin', 'earth'], program.theme))) {
        program.outputHelp();
    } else if (!program.theme) program.theme = 'napkin';

    if(!program.args[0]) {
        program.outputHelp();
        process.exit(1);
    }
    
    var mode;
    
    try {
        if(fs.lstatSync(program.args[0]).isFile()) mode = 'file';
        else if(fs.lstatSync(program.args[0]).isDirectory()) mode = 'directory';
        else {
            console.error('cannot read file or folder '+program.args[0]);
            process.exit(1);
        }
    } catch (err) {
        console.error('cannot read file or folder '+program.args[0]);
        process.exit(1);
    }

    var fileNames = [];
    var folder = '';
    if(mode === 'file') {
        folder = __dirname+'/';
        fileNames = [program.args[0]];
    } else if(mode === 'directory') {
        folder = __dirname+'/'+program.args[0]+'/';
        fileNames = yield fs.readdirAsync(program.args[0]);
    } 

    yield Promise.each(fileNames, function(fileName) {
        return createFileFromSource(folder, fileName); 
    });

    console.log('Done');
}

(Promise.coroutine(main))();

function createFileFromSource(folder, fileName) {
    return Promise.coroutine(function *() {
        var fileType = fileName.slice( (fileName.length - 'wsd'.length), fileName.length); 
        
        if(fileType !== 'wsd') {
            console.log('Ignoring file: '+fileName);
            return;
        }
        
        console.log('creating diagram for: '+fileName);
        var fileContent = yield fs.readFileAsync(folder+fileName);
        var result = yield wsd.diagramAsync(fileContent, program.theme, 'png');
        var diagramBuffer = result[0];
        return fs.writeFileAsync(folder+fileName.slice(0, fileName.length - '.wsd'.length)+'.png', diagramBuffer, 'binary');
    })();
}