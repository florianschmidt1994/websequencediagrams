var wsd 	= require('websequencediagrams'),
fs 			= require('fs');
async 		= require('async');
config  	= require('./config');

var createDiagram = function(file, callback) {
	
	async.waterfall([

		function readDiagramSources(callback) {
			
			fs.readFile('data/'+file, 'utf-8', callback);
		},

		function requestDiagrams(diagSrc, callback) {
			wsd.diagram(diagSrc, config.style, config.format, callback);
		}, 

		function createFiles(buf, type) {
			fs.writeFile('data/'+file.slice(0, file.length - '.wsd'.length)+'.png', buf);
		}], 

		function(err) {
			if(err) throw err;
			callback();
		});	
};

async.each(fs.readdirSync('data'), function(file, callback){
	fileType = file.slice( (file.length - 'wsd'.length), file.length); 
	if(fileType !== 'wsd') {
		console.log('Ignoring file: '+file);
	} else {
		console.log('creating diagram for: '+file);
		createDiagram(file, callback);
	}
});

