var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var path = require('canonical-path');
var _ = require('lodash');
var argv = require('yargs').argv;

var rewriter = require('./rewriter');

gulp.task('help', taskListing.withFilters(function(taskName) {
  var isSubTask = taskName.substr(0,1) == "_";
  return isSubTask;
}, function(taskName) {
  var shouldRemove = taskName === 'default';
  return shouldRemove;
}));

gulp.task('rewrite', function(done) {
  var filePath = argv.file || argv.f || argv._[0] || 'examples';
  var options;
  if (argv.outDir || argv.suffix) {
    options = {
      outDir: argv.outDir,
      suffix: argv.suffix
    }
  }
  // use default options if none is given.
  rewriter.rewrite(filePath, options).then(done);
});


//// no longer used - compile step moved into main.js
//function tscCompile(filePath) {
//  var fstat = fs.lstatSync(filePath);
//  var folderPath, options, srcGlob;
//  if (fstat.isDirectory()) {
//    folderPath = filePath;
//    options = {};
//    srcGlob = path.join(folderPath, '*.ts');
//  } else {
//    folderPath = path.dirname(filePath);
//    options = { files: [ filePath] };
//    srcGlob = filePath;
//  }
//
//  var options = {
//    "target": "ES5",
//    "module": "commonjs",
//    "sourceMap": true,
//    "emitDecoratorMetadata": true,
//    "experimentalDecorators": true,
//    "removeComments": false
//  };
//
//  var tsResult = gulp.src(srcGlob)
//    .pipe(tsc(options))
//    .pipe(gulp.dest(folderPath));
//  return streamToPromise(tsResult);
//}


gulp.task('default', ['help']);