var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var path = require('canonical-path');
var _ = require('lodash');
var argv = require('yargs').argv;
var exec = require('child_process').exec;
var Q = require('q');
var execPromise = Q.denodeify(exec);
var tsc = require('gulp-typescript');
var streamToPromise = require('stream-to-promise');
var fs = require('fs');

var angularVisitor = require('./angularVisitor');

gulp.task('help', taskListing.withFilters(function(taskName) {
  var isSubTask = taskName.substr(0,1) == "_";
  return isSubTask;
}, function(taskName) {
  var shouldRemove = taskName === 'default';
  return shouldRemove;
}));

// if no args - compiles and rewrites all ts files in the examples/simple dir
// if -f value ends in '.ts' then compiles all ts files and rewrites just the js version of the file specified.
// if -f value ends in '.js' then just rewrites the js file.
gulp.task('rewrite', function() {
  var filePath = argv.file || argv.f || 'simple';
  filePath = path.join('examples', filePath);
  var fstat = fileStats(filePath);
  if (fstat == null) {
    console.log('unable to locate file or folder: ' + filePath);
    return;
  }
  var dirName = path.dirname(filePath);
  var extName = path.extname(filePath);
  if (extName == '.ts') {
    // convert to .js
    filePath = path.join(dirName, path.basename(filePath, '.ts') + '.js');
  }

  if (fstat.isDirectory() || extName == '.ts') {
    var folderPath = fstat.isDirectory() ? filePath : dirName;
    tscCompile(folderPath).then(function () {
      rewrite(filePath);
    }).catch(function () {
      rewrite(filePath);
    })
  } else if (extName == '.js') {
    rewrite(filePath);
  } else {
    console.log('file path must end with ".js" or ".ts"');
  }

});

function tscCompile(folderPath) {
  var tsProject = tsc.createProject(path.join(folderPath, 'tsconfig.json'));
  var tsResult = gulp.src(path.join(folderPath, '/*.ts'))
    .pipe(tsc(tsProject));
  return streamToPromise(tsResult);
}

function rewrite(filePath) {

  var isDir = fs.lstatSync(filePath).isDirectory();

  if (isDir) {
    angularVisitor.rewriteFolder(filePath);
  } else {
    output = angularVisitor.rewriteFile(filePath);
    console.log(output);
  }
}

function fileStats(filePath) {
  try   {
    return fs.lstatSync(filePath);
  } catch (err) {
    return null;
  }
}

gulp.task('default', ['help']);