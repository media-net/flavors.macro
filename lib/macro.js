"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = _interopRequireDefault(require("./constants"));

var _utils = _interopRequireDefault(require("./utils"));

var _babelPluginMacros = require("babel-plugin-macros");

var _processor = _interopRequireDefault(require("./processor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
The basic AST logic - 
https://astexplorer.net/#/gist/3d66740ae62d8a324881d0ed3b47b803/529c309b805a3017e2103900155b05d9cb72c912
*/
function flavors(_ref) {
  var references = _ref.references,
      state = _ref.state,
      babel = _ref.babel,
      config = _ref.config;
  var _references$default = references.default,
      defaultImport = _references$default === void 0 ? [] : _references$default,
      _references$getFlavor = references.getFlavor,
      getFlavorImport = _references$getFlavor === void 0 ? [] : _references$getFlavor;
  defaultImport.forEach(function (referencePath) {
    if (_utils.default.isNull(referencePath)) {
      throw new _babelPluginMacros.MacroError("The reference path for the macro is empty!");
    } // Traverse through sibling and filter out the import-declarations
    // Depending on the type of value, find the expression
    // Not sure if while is the best way to go about this


    var limit = _constants.default.EXPRESSION_TRAVERSE_LIMIT;
    var currPath = referencePath;

    while (limit > 0 && currPath != null && currPath.type !== "ExpressionStatement") {
      currPath = currPath.parentPath;
      limit -= 1;
    }

    if (_utils.default.isEmptyStr(currPath)) {
      throw new _babelPluginMacros.MacroError("The macro should be used as an expressions statement! \n                Eg - flavors()");
    } else if (limit <= 0) {
      throw new _babelPluginMacros.MacroError("The macro should be used at the global scope. Cannot be nested. Cannot find the ExpressionStatement!");
    }

    var expPath = currPath;
    var currRefIndex = expPath.key;
    var bodyList = null;

    try {
      bodyList = expPath.parentPath.node.body;
    } catch (e) {
      throw new _babelPluginMacros.MacroError("Error fetching the macro-expression statement's parent-node - ", e);
    } finally {
      if (_utils.default.isNull(bodyList)) {
        throw new _babelPluginMacros.MacroError("The macro-expression statement's parent-node does not contain any body");
      }
    } // Iterate through every element from the top until the macro expression is reached


    for (var i = 0; i < currRefIndex; i++) {
      var entry = bodyList[i]; // Skip the non-import declaration

      if (entry.type !== "ImportDeclaration") {
        continue;
      } // Modify import value


      var importVal = entry.source.value; // Fetch from config

      var _Processor$modifyImpo = _processor.default.modifyImportStatement(importVal, config),
          isModified = _Processor$modifyImpo.isModified,
          importVal = _Processor$modifyImpo.importVal;

      if (false === isModified) {
        continue;
      } // Add the updated import-value


      entry.source.value = importVal;
      entry.source.extra.rawValue = importVal;
      entry.source.extra.raw = "'".concat(importVal, "'");
    } // Remove the macro expression


    expPath.remove();
  }); // AST-Explorer link -
  // https://astexplorer.net/#/gist/e9650e09940723b872eae6bef69175ca/7a8aef0401cf2352f25cc1e06bce3f6a9882bc03

  getFlavorImport.forEach(function (referencePath) {
    var refParent = referencePath.parentPath;

    if (refParent.type !== "CallExpression") {
      throw new _babelPluginMacros.MacroError("getFlavor needs to be a call-expression - eg. getFlavor(\"layout-theme-key\")");
    }

    var parentArgs = refParent.get("arguments");

    if (parentArgs.length < 0 || parentArgs.length > 1) {
      throw new _babelPluginMacros.MacroError("getFlavor requires 1 parameter");
    }

    var argNode = parentArgs[0].node;

    if (_utils.default.isNull(argNode)) {
      throw new _babelPluginMacros.MacroError("getFlavor requires an argument");
    }

    if (argNode.type !== "StringLiteral") {
      throw new _babelPluginMacros.MacroError("Argument for getFlavor cannot be anything other than a string-literal");
    } // Fetch value for key
    // If key does not exist, replace it with ""


    var keyVal = argNode.value;

    var flavorVal = _processor.default.getFlavorForKey(keyVal, config);

    if (_utils.default.isNull(flavorVal)) {
      flavorVal = "";
    } // Replace the original call 


    var flavorStrLiteral = babel.types.stringLiteral(flavorVal);
    refParent.replaceWith(flavorStrLiteral);
  });
}

var _default = (0, _babelPluginMacros.createMacro)(flavors, {
  configName: _constants.default.CONFIG_NAME
});

exports.default = _default;