// to allow running from command line  via
//    node rewrite -f=...

var rewriter = require('./rewriter');
var argv = require('yargs').argv;

var filePath = argv.file || argv.f || argv._[0] || 'examples';
var options;
if (argv.outDir || argv.suffix) {
  options = {
    outDir: argv.outDir,
    suffix: argv.suffix
  }
}
// use default options if none is given.
rewriter.rewrite(filePath, options).then(function() {
  console.log('done');
});
