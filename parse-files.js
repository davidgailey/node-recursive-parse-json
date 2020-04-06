/**
 * Simple Node.js recursivily copy/rename files with specific pattern
 * @license WTFPL
 * @usage $ node copyFiles.js
 */
var fs = require('fs'),
	config;
let finalList = [];
let finalString = 'Deer blog posts with with youtube entries \r\n';

// config options
config = {
	// targetDir: '/Users/davidgailey/Projects/node-recursive-parse-json/data',
	targetDir: '/Users/davidgailey/Downloads/deer/data',
	destinationFilename: '/Users/davidgailey/Projects/node-recursive-parse-json/finalList.txt',
	// removeFiles: false,
	// matchPattern: /^[_](.*)/gi,
	// replacePattern: '$1',
	// files: [
	// 	'_mytmpl.html',
	// 	'_mytmpl2.html'
	// ]
};

function walk(dir, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var i = 0;
		(function next() {
			var file = list[i++];
			if (!file) return done(null, results);
			file = dir + '/' + file;
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					// console.log('stat: '+ stat);
					walk(file, function (err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})();
	});
}

// function copyFileSync(srcFile, destFile, encoding) {
// 	var content = fs.readFileSync(srcFile, encoding || 'utf8');
// 	fs.writeFileSync(config.destinationPath + destFile, content, encoding || 'utf8');
// }

// function removeFile(srcFile) {
// 	fs.unlinkSync(srcFile, function (err) {
// 		if (err) throw err;
// 		console.log('Successfully deleted: ' + srcFile);
// 	});
// }

function getFileJSON (srcFile, encoding) {
	var content = fs.readFileSync(srcFile, encoding || 'utf8');
	console.info ('srcFile: ' + srcFile );
	// console.info (JSON.parse(content));
	// console.info ('content: ' + content );
	return JSON.parse(content);
}

function writeFinalList (content) {
	fs.writeFileSync(config.destinationPath + destFile, content, encoding || 'utf8');
}

// walk the directory recursively
walk(config.targetDir, function (err, results) {
	if (err) throw err;
	var matchedFiles = [];

	results.forEach(function (file, i) {
		var outputFile,
			targetFile = file.split('/').slice(-1)[0];
		
		// get JSON from file
		const fileJSON = getFileJSON(file);
		const id = fileJSON.id.value;
		let youtubeMatches = [];
		
		if(typeof fileJSON.text !== "undefined" && typeof fileJSON.text.value !== "undefined" ){
			// youtubeMatches = fileJSON.text.value.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/);
			// youtubeMatches = fileJSON.text.value.match('youtube.com');
			youtubeMatches = fileJSON.text.value.match(/https?:\/\/www.youtube.com\/[^"',]+/);
			// youtubeMatches = fileJSON.text.value.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm);
		}

		console.log ('-------------------------');
		console.log (id);
		// console.info (youtubeMatches.length);
		console.info (youtubeMatches);

		if (youtubeMatches !== null && youtubeMatches.length){
			console.info (youtubeMatches.length);
			console.info (youtubeMatches[0]);
			// matchedFiles.push(id);
			console.log('post matched: ' + id);
			console.log('urls matched: ' + youtubeMatches)

			let obj = {id: id, 
						urls: youtubeMatches,
						srcFile: targetFile
					};
			finalList.push(obj);
			
		}
	});

	// write final list to file
	console.log(finalList.length);

	for (let index = 0; index < finalList.length; index++) {
		// let instance = finalList[index];
		
		finalString += 'index: ' + index + '\r\n-----------------------\r\n';
		finalString += 'post id: ' + finalList[index].id + '\r\n';

		for (let i = 0; i < finalList[index].urls.length; i++) {
			// const url = finalList[index].urls[i];
			finalString += 'youtube url: ' + finalList[index].urls[i] + '\r\n';
		}

		finalString += 'src file: ' + finalList[index].srcFile + '\r\n \r\n';

	}

	console.log(finalString);
	fs.writeFileSync(config.destinationFilename, finalString, 'utf8');


});

