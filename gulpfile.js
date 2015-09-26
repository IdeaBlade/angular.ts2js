var gulp = require('gulp');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var taskListing = require('gulp-task-listing');
var path = require('canonical-path');
var del = require('del');
var _ = require('lodash');

var argv = require('yargs').argv;
var Q = require("q");
// delPromise is a 'promise' version of del
var delPromise =  Q.denodeify(del);
var Minimatch = require("minimatch").Minimatch;
var Dgeni = require('dgeni');
var fsExtra = require('fs-extra');
var fs = fsExtra;
var exec = require('child_process').exec;
var execPromise = Q.denodeify(exec);
var prompt = require('prompt');

gulp.task('help', taskListing.withFilters(function(taskName) {
  var isSubTask = taskName.substr(0,1) == "_";
  return isSubTask;
}, function(taskName) {
  var shouldRemove = taskName === 'default';
  return shouldRemove;
}));



gulp.task('default', ['help']);