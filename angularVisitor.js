var recast = require('recast');
var astTypes = require('ast-types');
var assert = require('assert');

var _ = require('lodash');

var fs = require('fs');
var path = require('canonical-path');
var globule = require('globule');

var _varsToRemove = ['__decorate', '__metadata' ];
var _varNameMap = {
  'angular2_1': 'ng',
  'test_lib': 'testLib'
};

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
    ngMap: { },
    varMap: {},
    scopeChain: [],
  };

  context.varMap["angular2_1"] = 'ng';

  astTypes.visit(ast, {
    visitProgram: function(path) {
      var node = path.node;
      scopeTraverse(this, path, context);
      var body = node.body;
      var iife = buildIIFE(body);
      node.body = [iife];
    },
    visitVariableDeclaration: function(path) {
      removeExtraneousDeclarations(path);
      var rNode = this.traverse(path);
      if (rNode == null) {
        // path was removed during traverse call above.
        return false;
      }
      collapseNgDeclarations(path, context);
      pruneEmptyDeclarations(path);
      return false;
    },
    visitVariableDeclarator: function(path) {
      addToCurrentScope(path, context);
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
      if (node.callee.name === 'require') {
        removeRequireCall(path, context);
        return false;
      }
      this.traverse(path);
    },
    visitMemberExpression: function(path) {
      changeAngularVarsToNg(path, context);
      this.traverse(path);
    },
    visitIdentifier: function(path) {
      renameIdentifierIfNeeded(path, context);
      this.traverse(path);
    }

  });
}

function renameIdentifierIfNeeded(idPath, context) {
  var node = idPath.node;
  var newName = getMappedVarName(node.name, context);
  if (newName) {
    node.name = newName;
  }
}

// change 'angular2_1' refs in any member expr to 'ng'
function changeAngularVarsToNg(mePath, context) {
  var node = mePath.node;
  if (node.object && node.object.type == 'Identifier') {
    var newName = getMappedVarName(node.object.name, context);
    if (newName) {
      node.object.name = newName;
    }
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

// remove any variable declarations in the _varsToRemove list.
function removeExtraneousDeclarations(vdPath) {
  var node = vdPath.node;
  var declarations = node.declarations;
  _.remove(declarations, function(declaration) {
    return _varsToRemove.indexOf(declaration.id.name) >= 0;
  });
}

// assign variable declarations for decorated items to previously calculated ng DSL chain.
// relies on context.ngMap having been updated via transformDecorateCall.
function collapseNgDeclarations(vdPath, context) {
  var declarations = vdPath.node.declarations;
  declarations.forEach(function(declaration) {
    var ngInfo = context.ngMap[declaration.id.name];
    if (ngInfo) {
      declaration.init = ngInfo.ngCall;
      // because we can't do vdPath.insertAfter(ngInfo.statements)
      vdPath.insertAfter.apply(vdPath, ngInfo.statements);
    }
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

function removeRequireCall(cePath, context) {
  var assignNode = getAssignmentIdentifier(cePath);
  if (!assignNode) return;
  addMappedVarName(assignNode.name, context);
  var vdPath = cePath.parent.parent;
  pruneButKeepComments(vdPath);

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
  var ngCall = b.identifier('ng');

  decorators.elements.forEach(function(decorator) {
    ngCall = b.callExpression(
      b.memberExpression(
        ngCall,
        decorator.callee.property
      ),
      decorator.arguments
    )
  });
  if (ctorFunc) {
    ngCall = b.callExpression(
      b.memberExpression(
        ngCall,
        b.identifier('Class')
      ),
      [ b.objectExpression( [
          b.property(
            'init',
            b.identifier('constructor'),
            b.functionExpression(null, ctorFunc.node.params, ctorFunc.node.body)
          )]
      )]
    )
    pruneButKeepComments(ctorFunc);
  }
  cePath.replace(ngCall);
  // identify parent and make cePath the first child of the parent
  var parentBlock = getParentOfType(cePath,'BlockStatement');
  var statements = parentBlock.node.body;
  var hasReturned = false;
  statements = statements.filter(function(statement) {
    if (hasReturned || statement.type === 'ReturnStatement') {
      // ts will sometimes generate variable declaration statements after the return statement
      // these can be ignored.
      hasReturned = true;
      return false;
    }
    if (statement.expression === cePath.parent.node) return false;
    return true;
  });
  context.ngMap[assignNode.name] = { ngCall: ngCall, statements: statements };

}



// return the identifier node on the left side of a callExpression if any.
function getAssignmentIdentifier(cePath) {
  var parent = cePath.parent.node;
  if (parent.type === 'AssignmentExpression') {
    if (parent.left.type !== 'Identifier') {
      return null;
    }
    return parent.left;
  } else if (parent.type === 'VariableDeclarator') {
    return parent.id;
  } else {
    return null;
  }
}



function addMappedVarName(varName, context) {
  var newVarName = _varNameMap[varName];
  if (!newVarName) {
    if (varName.substr(varName.length - 2) == "_1") {
      newVarName = varName.substr(0, varName.length - 2);
    }
  }
  if (newVarName) {
    context.varMap[varName] = newVarName;
  }
}

function getMappedVarName(varName, context) {
  var varNameMap = context.varMap;
  // insure that we don't pull from prototype.
  if (varNameMap.hasOwnProperty(varName)) {
    return varNameMap[varName];
  }
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
  context.scopeChain.push( { path: path, vars: {}, body: path.node.body });
  ast.traverse(path);
  var currentScope = context.scopeChain.pop();
}

function addToCurrentScope(vdPath, context) {
  var currentScope = getCurrentScope(context);
  var node = vdPath.node;
  currentScope.vars[node.id.name] = vdPath;
}

function getCurrentScope(context) {
  var scopeChain = context.scopeChain;
  return scopeChain[scopeChain.length - 1];
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
function getParentOfType(path, type) {
  var nextParent = path.parent;
  while (nextParent.node.type !== type) {
    nextParent = nextParent.parent;
    if (nextParent == null) {
      return null;
    }
  }
  return nextParent;
}

// inject '.rewrite.' into the fileName
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

//// not currently used
//function fixBodyComments(body) {
//  var lastNode = body[body.length - 1];
//  if (!lastNode.comments) return;
//
//  var comments = lastNode.comments;
//  var placeholder = astTypes.builders.emptyStatement();
//
//  placeholder.comments = [];
//  lastNode.comments = [];
//
//  comments.forEach(function (comment, idx) {
//    if (comment.trailing) {
//      placeholder.comments.push(comment);
//      comment.trailing = false;
//      comment.leading = true;
//    } else {
//      lastNode.comments.push(comment);
//    }
//  });
//
//  body.push(placeholder);
//}