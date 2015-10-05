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
// if -f value ends in '.ts' then compiles and rewrites the ts file specified.
// if -f value ends in '.js' then just rewrites the js file specified.
gulp.task('rewrite', function() {
  var filePath = argv.file || argv.f || 'simple';
  filePath = path.join('examples', filePath);
  var fstat = fileStats(filePath);
  if (fstat == null) {
    console.log('unable to locate file or folder: ' + filePath);
    return;
  }

  var extName = path.extname(filePath);

  if (fstat.isDirectory() || extName == '.ts') {
    var jsPath = fstat.isDirectory() ? filePath : changeExtn(filePath, '.js');
    tscCompile(filePath).then(function () {
      rewrite(jsPath);
    }).catch(function () {
      // most tscCompile errs are not actually fatal.
      rewrite(jsPath);
    })
  } else if (extName == '.js') {
    rewrite(filePath);
  } else {
    console.log('file path must end with ".js" or ".ts"');
  }

});

function tscCompile(filePath) {
  var fstat = fs.lstatSync(filePath);
  var folderPath, options, srcGlob;
  if (fstat.isDirectory()) {
    folderPath = filePath;
    options = {};
    srcGlob = path.join(folderPath, '*.ts');
  } else {
    folderPath = path.dirname(filePath);
    options = { files: [ filePath] };
    srcGlob = filePath;
  }
  options.module = "commonjs";
  // options.module = "amd";
  // options.module = "umd";
  // options.module = "system";
  var tsProject = tsc.createProject(path.join(folderPath, 'tsconfig.json'), options );
  var tsResult = gulp.src(srcGlob)
    .pipe(tsc(tsProject))
    .pipe(gulp.dest(folderPath));
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

function changeExtn(filePath, newExtn) {
  if (newExtn.indexOf(".") < 0) {
    newExtn = "." + newExtn;
  }
  return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + newExtn);
}

gulp.task('default', ['help']);