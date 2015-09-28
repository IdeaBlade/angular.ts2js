var gulp = require('gulp');
var taskListing = require('gulp-task-listing');
var path = require('canonical-path');
var _ = require('lodash');

var angularVisitor = require('./angularVisitor');

gulp.task('help', taskListing.withFilters(function(taskName) {
  var isSubTask = taskName.substr(0,1) == "_";
  return isSubTask;
}, function(taskName) {
  var shouldRemove = taskName === 'default';
  return shouldRemove;
}));

gulp.task('recast1', function() {
  var sourceFile = './examples/simple/app.js';
  var destFile = './examples/simple/app.rewrite.js';
  output = angularVisitor.rewriteFile(sourceFile, destFile);
  console.log(output);
});

gulp.task('recast', function() {
  var sourceFolder = './examples/simple';
  angularVisitor.rewriteFolder(sourceFolder);

});

gulp.task('default', ['help']);