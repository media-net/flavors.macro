"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utils =
/*#__PURE__*/
function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "isNull",
    value: function isNull(obj) {
      return typeof obj === "undefined" || obj === null;
    }
  }, {
    key: "isEmptyStr",
    value: function isEmptyStr(obj) {
      return this.isNull(obj) || obj === "";
    }
  }, {
    key: "isEmptyObj",
    value: function isEmptyObj(obj) {
      return this.isNull(obj) || Object.keys(obj).length === 0;
    }
    /**
     * Escape regex related symbols from string.
     * NOTE: Picked up from here - https://stackoverflow.com/a/6969486/1518924
     * Can't believe JS does not have an in-built method for this. Scratch that, I can really believe that :p
     * @param {string}
     * @returns {string}
     */

  }, {
    key: "escapeRegExp",
    value: function escapeRegExp(str) {
      if (typeof str !== "string") {
        return str;
      }

      return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }
  }]);

  return Utils;
}();

exports.default = Utils;