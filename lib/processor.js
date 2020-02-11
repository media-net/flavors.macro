"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = _interopRequireDefault(require("./constants"));

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Processor =
/*#__PURE__*/
function () {
  function Processor() {
    _classCallCheck(this, Processor);
  }

  _createClass(Processor, null, [{
    key: "modifyImportStatement",

    /**
     * Modify the input string val to the appropriate flavor.
     * If the input cannot be modified, then it would not contain the keyword required for replacement.
     * The return value dictates when it is modified.
     * @param {string} importVal 
     * @param {object|null} config 
     * @returns {object} {isModified: <bool>, importVal: <string>}
     */
    value: function modifyImportStatement(importVal, config) {
      var resp = {
        isModified: false,
        importVal: importVal
      };

      if (_utils.default.isNull(importVal)) {
        return resp;
      } // Fetch the flavor-map


      var flavorMap = Processor.getFlavorMapForConfig(config); // Import statement logic

      var isMatched = false;
      var replacementVal = null;
      var matchedKey = null;
      var matchedPathChar = null;

      for (var flavorKey in flavorMap) {
        if (false === flavorMap.hasOwnProperty(flavorKey)) {
          continue;
        }

        var isDefaultRegex = new RegExp("^.+([./])".concat(_utils.default.escapeRegExp(flavorKey), "(?:[./].+)?$"));
        var regexResults = importVal.match(isDefaultRegex);

        if (false === _utils.default.isNull(regexResults) && regexResults.length >= 2) {
          isMatched = true;
          matchedKey = flavorKey;
          replacementVal = flavorMap[matchedKey];
          matchedPathChar = regexResults[1];
          break;
        }
      } // Return if no entry matches


      if (false === isMatched || _utils.default.isNull(replacementVal)) {
        return resp;
      }
      /*
          NOTE: If replacement is an empty string, then don't add the additional period.
          For example -
          <replacement-val> => <replaced-string>
          "green" => abc.green.js
          "" => abc.js
      */


      if (replacementVal !== "") {
        replacementVal = "".concat(matchedPathChar).concat(replacementVal);
      }

      var defaultReplaceRegex = new RegExp("[./]".concat(_utils.default.escapeRegExp(matchedKey), "\\b"));
      importVal = importVal.replace(defaultReplaceRegex, "".concat(replacementVal)); // Setting up the final response

      resp.isModified = true;
      resp.importVal = importVal;
      return resp;
    }
    /**
     * Returns flavor for key. If key is invalid or not found, returns "" (empty-string)
     * @param {string} key 
     * @param {*} config 
     * @returns {string}
     */

  }, {
    key: "getFlavorForKey",
    value: function getFlavorForKey(key, config) {
      var defaultFlavorVal = "";

      if (_utils.default.isEmptyStr(key)) {
        return defaultFlavorVal;
      }

      var flavorMap = Processor.getFlavorMapForConfig(config);

      if (_utils.default.isEmptyObj(flavorMap)) {
        return defaultFlavorVal;
      }

      var flavorVal = flavorMap[key];

      if (_utils.default.isEmptyObj(flavorVal)) {
        return defaultFlavorVal;
      }

      return flavorVal;
    }
    /**
     * Creates a flavor map from the config. 
     * If the config is empty, creates a flavor-map with default values.
     * @param {object} config 
     */

  }, {
    key: "getFlavorMapForConfig",
    value: function getFlavorMapForConfig(config) {
      // Fetch the flavor-map
      var flavorMap = null;

      if (false === _utils.default.isEmptyObj(config)) {
        flavorMap = config[_constants.default.CONFIG_FLAVOR_MAP_KEY];
      } // Only if the flavor-map is empty is when the default flavors are applied
      // NOTE: If default needs to be avoided, then set flavorsMap: {}


      if (_utils.default.isNull(flavorMap)) {
        flavorMap = _defineProperty({}, _constants.default.DEFAULT_FLAVOR_KEY, _constants.default.DEFAULT_FLAVOR_THEME);
      }

      return flavorMap;
    }
  }]);

  return Processor;
}();

exports.default = Processor;