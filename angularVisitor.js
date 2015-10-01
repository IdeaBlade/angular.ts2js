var recast = require('recast');
var astTypes = require('ast-types');
var assert = require('assert');

var _ = require('lodash');

var fs = require('fs');
var path = require('canonical-path');
var globule = require('globule');

var _varsToRemove = ['__decorate', '__metadata', 'angular2_1'];

function rewrite(source) {
  // HACK: The dummy var is needed to work around the following recast issue.
  // https://github.com/benjamn/recast/issues/191
  var dummy = '\nvar __dummy;';
  var ast = recast.parse(source + dummy);
  visit(ast);
  var output = recast.print(ast).code;
  // remove the sourceMappingURL line from the output.
  output = output.replace(/(?:\r\n|\r|\n).*sourceMappingURL=.*/, '');
  output = output.replace(/(?:\r\n|\r|\n).*var __dummy.*/, '');
  return output;
}

function rewriteFile(sourceFile, destFile) {
  var source =fs.readFileSync(sourceFile);
  destFile = destFile || getRewriteFileName(sourceFile);
  output = rewrite(source);
  fs.writeFileSync(destFile, output);
  return output;
}

function rewriteFolder(sourceFolder) {
  var gpath = path.join(sourceFolder, '*.js');
  var fileNames = globule.find([gpath, '!**/*.rewrite*.js']);
  fileNames.forEach(function(fileName) {
    console.log('rewriting ' + fileName);
    rewriteFile(fileName);
  });
}

// TODO: need to keep any comments in variable declarations.
function visit(ast) {

  var context = {
    funcMap: {},
    ngMap: {},
    scopeChain: []
  };

  astTypes.visit(ast, {
    visitProgram: function(path) {
      var node = path.node;
      scopeTraverse(this, path, context);
      var body = node.body;
      var iife = buildIIFE(body);
      node.body = [iife];
    },
    visitVariableDeclaration: function(path) {
      removeExtraneousVars(path);
      this.traverse(path);
      transformNgDeclarations(path, context);
      pruneEmptyDeclarations(path);
    },
    visitVariableDeclarator: function(path) {
      var node = path.node;
      addToCurrentScope(path, context);
      console.log(printScope(context));
      this.traverse(path);
    },
    visitFunctionDeclaration: function(path) {
      capturePossibleCtors(path, context);
      scopeTraverse(this, path, context);
    },
    visitFunctionExpression: function(path) {
      scopeTraverse(this, path, context);
    },
    visitCallExpression: function(path) {
      var node = path.node;
      if (node.callee.name === '__decorate') {
        transformDecorateCall(path, context);
      }
      this.traverse(path);
    },
    visitMemberExpression: function(path) {
      changeAngularVarsToNg(path);
      this.traverse(path);
    }

  });
}

// change 'angular2_1' refs in any member expr to 'ng'
function changeAngularVarsToNg(mePath) {
  var node = mePath.node;
  if (node.object && node.object.type == 'Identifier' && node.object.name == 'angular2_1') {
    node.object.name = 'ng';
  }
}

// capture any function declarations that might be constructors.
function capturePossibleCtors(fdPath, context) {
  var node = fdPath.node;
  var name = node.id && node.id.name;
  if (name) {
    context.funcMap[name] = fdPath;
  }
}

// assign variable declarations for decorated items to previously calculated ng DSL chain.
function transformNgDeclarations(vdPath, context) {
  var declarations = vdPath.node.declarations;
  declarations.forEach(function(declaration) {
    var ngExpr = context.ngMap[declaration.id.name];
    if (ngExpr) {
      declaration.init = ngExpr;
    }
  });
}

// remove any variable declarations in the _varsToRemove list.
function removeExtraneousVars(vdPath) {
  var node = vdPath.node;
  var declarations = node.declarations;
  _.remove(declarations, function(declaration) {
    return _varsToRemove.indexOf(declaration.id.name) >= 0;
  });
}

// if a variable declaration is empty; remove it.
function pruneEmptyDeclarations(vdPath) {
  var declarations = vdPath.node.declarations;
  if (declarations.length == 0) {
    pruneButKeepComments(vdPath);
  }
}

function pruneButKeepComments(path) {
  var node = path.node;
  // keep any comments that were on the just pruned node.
  if (node.comments && node.comments.length > 0) {
    var parent = path.parent.value;
    parent.comments = parent.comments || [];
    Array.prototype.push.apply(parent.comments, node.comments);
  }
  path.prune();
}

// transform a __decorate call expression to use ng DSL call chain.
function transformDecorateCall(cePath, context) {
  var node = cePath.node;

  var assignNode = getAssignmentIdentifier(cePath);
  var ctorFunc = context.funcMap[assignNode.name];
  // replace the parent with a block expression
  // containing just the non-metadata arguments to __decorate
  var args = node.arguments;
  var decorators = args[0];
  var target = args[1];
  assert(decorators && decorators.type === 'ArrayExpression', "__decorate arguments should be an array");
  decorators.elements = decorators.elements.filter(function(ele) {
    // remove _metadata
    if (ele.callee && ele.callee.type === 'Identifier' && ele.callee.name == '__metadata') {
      return false;
    } else {
      return true;
    }
  });
  var b = astTypes.builders;
  var obj = b.identifier('ng');

  decorators.elements.forEach(function(decorator) {
    obj = b.callExpression(
      b.memberExpression(
        obj,
        decorator.callee.property
      ),
      decorator.arguments
    )
  });
  if (ctorFunc) {
    obj = b.callExpression(
      b.memberExpression(
        obj,
        b.identifier('Class')
      ),
      [ b.objectExpression( [
          b.property(
            'init',
            b.identifier('constructor'),
            b.functionExpression(null, [], ctorFunc.node.body)
          )]
      )]
    )
    pruneButKeepComments(ctorFunc);
  }
  cePath.replace(obj);
  context.ngMap[assignNode.name] = obj;

}

// return the identifier on the left side of a callExpression if any.
function getAssignmentIdentifier(cePath) {
  var parent = cePath.parent.value;
  if (parent.type !== 'AssignmentExpression') {
    return null;
  }
  if (parent.left.type !== 'Identifier') {
    return null;
  }
  return parent.left;
}

// build an IIFE around the specified node.
function buildIIFE(node) {
  var b = astTypes.builders;
  var iife = b.expressionStatement(
    b.callExpression(
      b.functionExpression(
        null,
        [],
        b.blockStatement(node)
      ),
      []
    )
  );
  return iife;
}

function scopeTraverse(ast, path, context) {
  context.scopeChain.push( { path: path, vars: {} });
  ast.traverse(path);
  var currentScope = context.scopeChain.pop();
}

function addToCurrentScope(vdPath, context) {
  var scopeChain = context.scopeChain;
  var currentScope = scopeChain[scopeChain.length - 1];
  var node = vdPath.node;
  currentScope.vars[node.id.name] = vdPath;
}


function printScope(context){
  var result = [];
  context.scopeChain.forEach(function(scope) {
    var node = scope.path.node;
    var r;
    if (node.type === 'Program'){
      r = 'global scope:';
    } else if (node.id && node.id.name){
      r = 'function(' + node.id.name + ')';
    } else {
      r = 'anon function'
    }
    var vars = _.keys(scope.vars).join(',');
    result.push(r + ": " + vars);
  });
  return result.join('\n');
}

function getVarDef(varname, scopeChain){
  for (var i = 0; i < scopeChain.length; i++){
    var scope = scopeChain[i];
    var varDef = scope[varName];
    if (varDef) {
      return varDef;
    }
  }
  return null;
}

// not currently used
function fixBodyComments(body) {
  var lastNode = body[body.length - 1];
  if (!lastNode.comments) return;

  var comments = lastNode.comments;
  var placeholder = astTypes.builders.emptyStatement();

  placeholder.comments = [];
  lastNode.comments = [];

  comments.forEach(function (comment, idx) {
    if (comment.trailing) {
      placeholder.comments.push(comment);
      comment.trailing = false;
      comment.leading = true;
    } else {
      lastNode.comments.push(comment);
    }
  });

  body.push(placeholder);
}

function getRewriteFileName(fileName) {
  var dirName = path.dirname(fileName);
  var extName = path.extname(fileName);
  var baseName = path.basename(fileName, extName);

  var newName = path.join(dirName, baseName + '.rewrite' + extName);
  return newName;
}

module.exports = {
  rewrite: rewrite,
  rewriteFile: rewriteFile,
  rewriteFolder: rewriteFolder
};
