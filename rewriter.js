var path = require('canonical-path');
var _ = require('lodash');
var cp = require('child_process');
var Q = require('q');
var fs = require('fs');
var mkdirp = require('mkdirp');
var glob = require('glob');
var globule = require('globule');

var angularVisitor = require('./angularVisitor');

// filePath can be either a file or a dir
// if a dir then all .ts files in the dir will be compiled and then rewritten.
// if a file it can have either a '.ts' or '.js' extn.
//   if a .ts file then it will be compiled and rewriten.
//   if a .js file then it will be just rewritten.
// options: object
//   outDir:
//   suffix: defaults to 'rewrite'
// returns a promise
function rewrite(filePath, options) {
  options = options || { suffix: 'rewrite' }
  var fstat = fileStats(filePath);
  if (fstat == null) {
    console.log('unable to locate file or folder: ' + filePath);
    return;
  }
  var isDir = fstat.isDirectory();
  var extName = path.extname(filePath);
  if (isDir || extName == '.ts') {
    var jsPath = isDir ? filePath : changeExtn(filePath, '.js');
    return tscCompile(filePath).then(function () {
      rewriteJs(jsPath, options);
    }).catch(function () {
      // most tscCompile errs are not actually fatal.
      rewriteJs(jsPath, options);
    })
  } else if (extName == '.js') {
    rewriteJs(filePath, options);
    return Q.when();
  } else {
    var msg = 'file path must end with ".js" or ".ts"';
    console.log(msg);
    return Q.reject(msg);
  }
}

// returns a promise
function tscCompile(filePath) {
  var filePaths;
  var isDir = fs.lstatSync(filePath).isDirectory();
  if (isDir) {
    filePaths = glob.sync(path.join(filePath, '**/*.ts'));
  } else {
    filePaths = [ filePath];
  }
  return runTsc(filePaths, true);
}

function rewriteJs(filePath, options) {
  var isDir = fs.lstatSync(filePath).isDirectory();
  if (isDir) {
    rewriteFolder(filePath, options);
  } else {
    output = rewriteFile(filePath, options);
    console.log(output);
  }
}

function rewriteFolder(sourceFolder, options) {
  var gpath = path.join(sourceFolder, '**/*.js');
  var fileNames = globule.find([gpath, '!**/*.rewrite*.js']);
  fileNames.forEach(function(fileName) {
    console.log('rewriting ' + fileName);
    rewriteFile(fileName, options);
  });
}

function rewriteFile(sourceFile, options) {
  var source =fs.readFileSync(sourceFile);
  var destFile = getRewriteFileName(sourceFile, options);
  output = angularVisitor.rewrite(source);
  fs.writeFileSync(destFile, output);
  return output;
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

// returns a promise
function runTsc(filePaths, shouldLog) {
  var deferred = Q.defer();
  var results = [];
  var nmPath = 'node_modules/typescript/lib/tsc.js';
  var tscjs = path.join(process.cwd(), nmPath);
  // HACK
  if (!fs.existsSync(tscjs)) {
    // this will happen if this package is installed into another dir.
    tscjs = path.join(process.cwd(), 'node_modules/angular.ts2js/', nmPath);
  }
  console.log('Running tsc from ' + tscjs);
  var compilerArgs = ['--target','ES5', '--module', 'commonjs', '--emitDecoratorMetadata', '--experimentalDecorators'];
  var args = [tscjs].concat(filePaths, compilerArgs);
  var childProcess = cp.spawn('node', args, { cwd: process.cwd() });
  childProcess.stdout.on('data', function (data) {
    collectResults(data);
  });
  childProcess.stderr.on('data', function (data) {
    collectResults(data);
    deferred.reject(results.join(' '));
  });
  childProcess.on('close', function (data) {
    deferred.resolve( { returnValue: data, results: results.join(' ')} );
  });
  return deferred.promise;

  function collectResults(data) {
    var r = data.toString();
    if (shouldLog) {
      console.log(r)
    }
    results.push(r);
    return results;
  }
}

// inject '.rewrite.' into the fileName
function getRewriteFileName(fileName, options) {
  var dirName = options.outDir || path.dirname(fileName);
  // insure that the folder exists.
  if (!fs.existsSync(dirName)) {
    mkdirp.sync(dirName);
  }
  var extName = path.extname(fileName);
  var baseName = path.basename(fileName, extName);
  var suffix = (options.suffix && options.suffix.length) ? '.' + options.suffix : '';
  var newName = path.join(dirName, baseName + suffix + extName);
  return newName;
}

//// returns a promise - BUT... problem is that the 'real' errors don't show up if 'err' variable.
//function runTscExec(filePath) {
//  var tscjs = path.join(process.cwd(), 'node_modules/typescript/bin/tsc.js');
//  var args = [tscjs, filePath, '--target','ES5', '--module', 'commonjs', '--emitDecoratorMetadata', '--experimentalDecorators' ];
//  var execPromise = Q.denodeify(cp.exec);
//  return execPromise('node ' + args.join(" "), { cwd: process.cwd() }).then(function(data) {
//  // return childProcess = execPromise('npm run tsc -- ' + args.join(' '), { cwd: process.cwd() }).then(function(data) {
//    console.log(data.toString());
//    return data.toString();
//  }).catch(function(err) {
//    console.log(err.toString());
//    return err.toString();
//  });
//}

module.exports = {
  rewrite: rewrite
};