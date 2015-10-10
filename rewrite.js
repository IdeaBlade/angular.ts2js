// to allow running from command line  via
//    node rewrite -f=...

var rewriter = require('./rewriter');
var argv = require('yargs').argv;

var filePath = argv.file || argv.f || argv._[0] || 'examples';
rewriter.rewrite(filePath).then(function() {
  console.log('done');
});
