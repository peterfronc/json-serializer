/*
 * Copyright 2013-2014, Qubit Group
 * http://opentag.qubitproducts.com
 * @author Peter Fronc peter.fronc@qubitproducts.com
 *
 * This library is licensed under LGPL v3 license.
 * For details please see attached LICENSE file or go to:
 * https://www.gnu.org/licenses/lgpl.html
 */

(function () {

  function Json (config) {
    this.config = config;

    if (config) {
      if (config.prettyPrint !== undefined) {
        this.prettyPrint = true;
      }
      if (config.raw !== undefined) {
        this.raw = config.raw;
      } //json type as default
      if (config.renderRedirect !== undefined) {
        this.renderRedirect = config.renderRedirect;
      } //json type as default
      if (config.excludeInstances !== undefined) {
        this.excludeInstances = config.excludeInstances;
      }
      if (config.excludeTypes !== undefined) {
        this.excludeTypes = config.excludeTypes;
      }
      if (config.exclude !== undefined) {
        this.exclude = config.exclude;
      }
      if (config.excludeNames !== undefined) {
        this.excludeNames = config.excludeNames;
      }
      if (config.excludeMatches !== undefined) {
        this.excludeMatches = config.excludeMatches;
      }
      if (config.hasOwn !== undefined !== undefined) {
        this.hasOwn = config.hasOwn;
      }
      if (config.fakeFunctions !== undefined) {
        this.fakeFunctions = config.fakeFunctions;
      }
      if (config.realFunctions !== undefined) {
        this.realFunctions = config.realFunctions;
      }
      if (config.includeFunctions !== undefined) {
        this.includeFunctions = config.includeFunctions;
      }
      if (config.excludeOnTrue !== undefined) {
        this.excludeOnTrue = config.excludeOnTrue;
      }
      if (config.dateAsString !== undefined) {
        this.dateAsString = config.dateAsString;
      }
      if (config.TAB !== undefined) {
        this.TAB = config.TAB;
      }
      if (config.PROP_INDENT !== undefined) {
        this.PROP_INDENT = config.PROP_INDENT;
      }
      if (config.COMMA !== undefined) {
        this.COMMA = config.COMMA;
      }
      if (config.level !== undefined) { // backwards compatibility
        this.levelMax = config.level;
      }
      if (config.levelMax !== undefined) {
        this.levelMax = config.levelMax;
      }
      if (config.trackParentPath !== undefined) {
        this.trackParentPath = config.trackParentPath;
      }
      if (config.getEOL !== undefined) {
        this.getEOL = config.getEOL;
      }
    }
  }

  Json.prototype = {
    TAB: "  ",
    PROP_INDENT: ": ",
    COMMA: ",",
    excludeInstances: null,
    excludeTypes: null,
    exclude: null,
    excludeMatches: null,
    excludeNames: null,
    hasOwn: true,
    includeFunctions: false,
    excludeOnTrue: null,
    dateAsString: true,
    raw: false,
    fakeFunctions: false,
    realFunctions: false,
    prettyPrint: false,
    renderRedirect: null,
    levelMax: -1
  };

  var EOL = "\n";
  /**
   * Function used to return EOL when in prettyPrint mode.
   * Ideal to wrap up elements.
   * @param {type} object
   * @param {type} parentElements
   * @param {type} parentPathElements
   * @returns {jsonL#11.EOL}
   */
  Json.prototype.getEOL = function (
      object, parentElements, parentPathElements) {
    return EOL;
  };

  /**
   * Function used to draw object (and array) primitive values.
   * @param {type} string
   * @param {type} object
   * @param {type} level
   * @param {type} parentPathElements
   * @returns {unresolved}
   */
  Json.prototype.drawValue = function (
        string, object, level, parentPathElements) {
      return string;
  };

  /**
   * Function used to draw property of objects.
   * @param {type} key
   * @param {type} object
   * @param {type} parentElements
   * @param {type} level
   * @returns {String}
   */
  Json.prototype.drawProperty = function (
          key, object, parentElements, level, parentPathElements) {
    return (["\"", key.replace(/\"/g, "\\\""), "\"", this.PROP_INDENT].join(""));
  };

  /**
   *
   * @param {type} indentString
   * @param {type} parts
   * @param {type} object
   * @param {type} parentElements
   * @returns {String}
   */
  Json.prototype.drawArray = function (
                      indentString,
                      parts,
                      object,
                      parentElements,
                      parentPathElements) {
    return this.drawGeneralObject(
      "[", "]",
      indentString,
      parts,
      object,
      parentElements,
      parentPathElements);
  };

  Json.prototype.drawObject = function (
                      indentString,
                      parts,
                      object,
                      parentElements,
                      parentPathElements) {
    return this.drawGeneralObject(
      "{", "}",
      indentString,
      parts,
      object,
      parentElements,
      parentPathElements);
  };

  Json.prototype.drawGeneralObject = function (
          lbracket, rbracket,
          indentString,
          parts,
          object,
          parentElements,
          parentPathElements) {
    var array;

    if (indentString || this.prettyPrint) {
      if (parts.length === 0) {
        array = [lbracket, parts.join(this.COMMA), rbracket];
      } else {
        var eol = this.getEOL(object, parentElements, parentPathElements);
        array = [
          lbracket, eol,
          indentString, this.TAB,
          parts.join(this.COMMA + eol + indentString + this.TAB),
          eol, indentString, rbracket
        ];
      }
    } else {
      array = [lbracket, parts.join(this.COMMA), rbracket];
    }

    return array.join("");
  };

  /**
   * Serializing function.
   * @param {Object} object
   * @returns {String} serialized object
   */
  Json.prototype.serialize = function (object) {
    var level = 0;
    var parentElements = [];
    var parentPathElements;
    if (this.trackParentPath) {
      parentPathElements = [];
    }
    return this._processor(
              object,
              parentElements,
              level,
              parentPathElements);
  };

  Json.prototype.updatePathElements = function (parentPathElements, level, propOrIdx) {
    if (parentPathElements && level > 1) {
      parentPathElements[level - 2] = propOrIdx;
    }
  };

  Json.prototype.clearPathElements = function (parentPathElements, level) {
    if (parentPathElements) {
      return parentPathElements.splice(level - 1);
    }
  };

  /*
   * @private
   * Serializer engine.
   * @param {type} object
   * @param {type} parentElements
   * @param {type} level
   * @param {type} propOrIdx
   * @returns {nm$_json.jsonL#11.Json.prototype@call;drawValue|undefined|String}
   */
  Json.prototype._processor = function (
                                  object,
                                  parentElements,
                                  level,
                                  parentPathElements,
                                  propOrIdx) {
    if (this.levelMax >= 0 && level >= this.levelMax) {
      return undefined;
    }

    var i;

    var indent = "";
    if (this.prettyPrint) {
      for (i = 0; i < level; i++) {
        indent += this.TAB;
      }
    }

    if (this.excludeOnTrue) {
      try {
        if (this.excludeOnTrue(object)) {
          return undefined;
        }
      } catch (ex) {
      }
    }

    if (typeof this.renderRedirect === "function") {
      var rendered = this.renderRedirect(object, propOrIdx);
      if (typeof rendered === "string") {
        return jsonString(rendered);
      }
    }

    // indent is used as boolean here!
    if (object instanceof Date) {
      return this.drawValue(
                (!this.raw || this.dateAsString) ?
                  jsonString(object.toISOString()) : object.valueOf(),
                object,
                level,
                parentPathElements);
    } else if (!this.includeFunctions && typeof object === "function") {
      return undefined;
    } else if (typeof object === "number") {
      return this.drawValue(String(object), object, level, parentPathElements);
    } else if (typeof object === "string") {
      return this.drawValue(jsonString(object), object, level);
    } else if (object === null) {
      return this.drawValue("null", object, level, parentPathElements);
    } else if (object === undefined) {
      return this.raw ? this.drawValue("undefined", object, level, parentPathElements) : undefined;
    } else if (typeof object === "boolean") {
      return this.drawValue(String(object), object, level, parentPathElements);
    }

    if (this.includeFunctions && typeof object === "function") {
      if (this.fakeFunctions) {
        return "(function () {})";
      }
    }

    if (this.includeFunctions && typeof object === "function") {
      if (this.realFunctions) {
        // @todo
        var out = this.prettyPrint ? object.toString() : object.toString();
        return this.drawValue(out, object, level, parentPathElements);
      }
    }

    if (objectExistsInParentElements(object, parentElements)) {
      return undefined;//"\"[parent contained]\"";
    }

    parentElements.push(object);
    ++level;

    var strings;

    if (object instanceof Array) {
      strings = [];
      for (i = 0; i < object.length; i++) {
        if (this.excludeInstances && checkIfInstanceOf(object, this.excludeInstances)) {
          continue;
        }
        if (this.excludeTypes && checkIfTypeOf(object, this.excludeTypes)) {
          continue;
        }
        var el;
        try {
          var obj = object[i];
          if (!this.raw && (obj === undefined)) {
            obj = null;
          }
          this.updatePathElements(parentPathElements, level, propOrIdx);
          el = this._processor(obj, parentElements, level, parentPathElements, i);
        } catch (ex) {
          cancelCurrentObjectFromTracking(level, parentElements);
          this.clearPathElements(parentPathElements, level);
          return jsonString(String(ex));
        }
        if (el !== undefined) {
          strings.push(el);
        }
      }
      cancelCurrentObjectFromTracking(level, parentElements);
      this.clearPathElements(parentPathElements, level);
      return this.drawArray(
              indent,
              strings,
              object,
              parentElements,
              parentPathElements);
    }

    // else:
    strings = [];
    for (var key in object) {
      var prop = object[key];
      if (this.hasOwn && !object.hasOwnProperty(key)) {
        continue;
      }
      if (this.excludeInstances && checkIfInstanceOf(prop, this.excludeInstances)) {
        continue;
      }
      if (this.excludeTypes && checkIfTypeOf(prop, this.excludeTypes)) {
        continue;
      }
      if (this.excludeNames && checkIfNameOf(key, this.excludeNames)) {
        continue;
      }
      if (this.exclude && checkIfExcluded(prop, this.exclude)) {
        continue;
      }
      if (this.excludeMatches && checkIfNameMatch(key, this.excludeMatches)) {
        continue;
      }
      try {
        this.updatePathElements(parentPathElements, level, propOrIdx);
        var objEl =
                this._processor(prop, parentElements, level, parentPathElements, key);
        if (objEl !== undefined) {
          var elString =
                  this.drawProperty(key, object, parentElements, level, parentPathElements) + objEl;
          strings.push(elString);
        }
      } catch (ex) {//SOME OBJECT CAN THROW EXCEPTION ON Access, FRAMES ETC.
        cancelCurrentObjectFromTracking(level, parentElements);
        this.clearPathElements(parentPathElements, level);
        return jsonString(String(ex));
      }
    }
    cancelCurrentObjectFromTracking(level, parentElements);
    this.clearPathElements(parentPathElements, level);
    return this.drawObject(indent, strings, object, parentElements, parentPathElements);

  };

  Json.prototype.parse = function (string) {
    if (!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
        string.replace(/"(\\.|[^"\\])*"/g, '')))) {
      var expression = "json.___tmp = (" + string + ")";
      if (global.execScript) {
        global.execScript(expression);
      } else {
        (function () {return global["eval"].call(global, expression); }());
      }
    } else {
      throw "insecure json!";
    }
    return json.___tmp;
  };

function checkIfInstanceOf(object, instances) {
    for (var i = 0; i < instances.length; i++) {
      if ((typeof(instances[i]) === "function") && /*ie case*/
            object instanceof instances[i]) {
        return true;
      }
    }
    return false;
  }

  function checkIfTypeOf(object, types) {
    for (var i = 0; i < types.length; i++) {
      if (typeof(object) === types[i]) {
        return true;
      }
    }
    return false;
  }

  function checkIfExcluded(object, exclude) {
    for (var i = 0; i < exclude.length; i++) {
      if (object === exclude[i]) {
        return true;
      }
    }
    return false;
  }

  function checkIfNameMatch(string, matches) {
    try {
      for (var i = 0; i < matches.length; i++) {
        if (matches[i].test(string)) {
          return true;
        }
      }
    } catch (ex) {
    }
    return false;
  }

  function checkIfNameOf(string, names) {
    for (var i = 0; i < names.length; i++) {
      if (string === names[i]) {
        return true;
      }
    }
    return false;
  }

  function objectExistsInParentElements(object, parentElements) {
    if (object instanceof Object) {
      for (var i = 0; i < parentElements.length; i++) {
        if (parentElements[i] === object) {
          return true;
        }
      }
    }
    return false;
  }

  function cancelCurrentObjectFromTracking(level, array) {
    array.splice(level - 1);
  }

  function jsonString(object) {
    if (typeof object !== "string") {
      return "\"" + object + "\"";
    }
    return "\"" + object
            .replace(/\\/g, "\\\\")
            .replace(/\"/g, "\\\"")
            .replace(/\n/g, "\\n") +
            "\"";
  }

  var json = {};

  json.Json = Json;

  /**
   * Exclusive and luxury javascript serializer.
   *
   * Config object assignment:
   *
   * <pre>
   *   config.excludeInstances Instanceof will be called
   *      on  excludeInstancess functions array
   *   config.excludeTypes array of objects that typeof
   *    will be called in order to exclude properties on object
   *   config.excludeNames array of strings that will be check
   *    on object's properties
   *   config.renderRedirect custom renderer function, must return string,
   *      any other value will be ignored, note that it should skip objects.
   *   config.hasOwn if hasOwnProperty should apply for objects
   *        (default false)
   *   config.realFunctions serializer will output toString of function objects,
   *    this option only applies if includeFunctions is enabled
   *   config.fakeFunctions if includeFunctions is applied, this option will cause
   *    empty function to be attached for such objects.
   *   config.includeFunctions if
   *      functions should be included (default false), if only this option is specified
   *      fuinctions will be treated as objects and serializer will go over its properties.
   *   config.excludeOnTrue function that will take
   *      current objects property and must return boolean, if returns true,
   *      object will be added to serialized string
   *   config.levelMax if specified, how maximally deep
   *    properties generation can go.
   *   config.dateAsString = treat dates as strings (default true)
   *   config.raw dont use "json" specific output and serialize real values
   *     (undefines, dates as numbers)
   *
   *
   *
   * </pre>
   *
   * @param {type} object
   * @param {Object} config
   * @returns {String}
   */
  json.serialize = function (object, config) {
    var inst = new Json(config);
    config = config || {};
    if (config.drawValue) {
      inst.drawValue = config.drawValue;
    }
    if (config.drawProperty) {
      inst.drawProperty = config.drawProperty;
    }
    if (config.drawObject) {
      inst.drawObject = config.drawObject;
    }
    if (config.drawArray) {
      inst.drawObject = config.drawArray;
    }
    if (config.drawGeneralObject) {
      inst.drawGeneralObject = config.drawGeneralObject;
    }
    return inst.serialize(object);
  };

  var global = (0, eval("this")) || (function () {return this; }()) ||
          this.window;

  /**
   * Parsing json function with specification specified in RFC4627, section 6.
   * It is a simple security check. Enough for most of needs.
   * @param {type} string
   * @returns {RegExp}
   */
  json.parse = function (string) {
    return new Json().parse(string);
  };

  global.json = json;

  /**
   * Simple function securing string to be used in json.
   */
  json.jsonString = jsonString;

  try {
    module.exports = json;
  } catch (e) {
    //try exports
  }
}());
