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

  var json = {
    TAB: "  ",
    PROP_INDENT: " ",
    COMMA: ","
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

  json.checkIfInstanceOf = checkIfInstanceOf;

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

  function removeFromArray(object, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === object) {
        array.splice(i, 1);
      }
    }
    return array;
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

  json.drawValue = function (indentString, string, object) {
      return string;
  };

  json.drawProperty = function (key, object, parentElements, level, PROP_INDENT) {
    return (["\"", key.replace(/\"/g, "\\\""), "\"", PROP_INDENT].join(""));
  };

  json.drawArray = function (
                      indentString,
                      prettyPrint,
                      parts,
                      tab, comma, object, parentElements) {
    return json.drawGeneralObject(
      "[", "]",
      indentString,
      prettyPrint,
      parts,
      tab, comma, object, parentElements)
  };

  json.drawObject = function (
                      indentString,
                      prettyPrint,
                      parts,
                      tab, comma, object, parentElements) {
    return json.drawGeneralObject(
      "{", "}",
      indentString,
      prettyPrint,
      parts,
      tab, comma, object, parentElements)
  };

  json.drawGeneralObject = function (
          lbracket, rbracket,
          indentString, prettyPrint,
          parts,
          tab, comma, object, parentElements) {

    var array;

    if (indentString || prettyPrint) {
      if (parts.length === 0) {
        array = [lbracket, parts.join(comma), rbracket];
      } else {
        array = [
          lbracket, "\n",
          indentString, tab,
          parts.join(comma + "\n" + indentString + tab),
          "\n", indentString, rbracket
        ];
      }
    } else {
      array = [lbracket, parts.join(comma), rbracket];
    }

    return array.join("");
  };

  var _serialize = function (
          object,
          config,
          parentElements,
          level,
          levelMax,
          propOrIdx) {

    var excludeInstances, excludeTypes, exclude, excludeMatches,
              excludeNames,
              hasOwn = true,
              includeFunctions = false,
              excludeOnTrue = false,
              dateAsString = true,
              raw = false,
              fakeFunctions = false,
              realFunctions = false,
              prettyPrint = false,
              render,
              drawValue = json.drawValue,
              drawProperty = json.drawProperty,
              drawObject = json.drawObject,
              drawArray = json.drawArray,
              TAB = json.TAB,
              PROP_INDENT = json.PROP_INDENT,
              COMMA = json.COMMA;

    if (config) {
      if (config.prettyPrint) {
        prettyPrint = true;
      }
      if (config.raw) {
        raw = config.raw;
      } //json type as default
      if (config.renderFunction) {
        render = config.renderFunction;
      } //json type as default
      if (config.excludeInstances) {
        excludeInstances = config.excludeInstances;
      }
      if (config.excludeTypes) {
        excludeTypes = config.excludeTypes;
      }
      if (config.exclude) {
        exclude = config.exclude;
      }
      if (config.excludeNames) {
        excludeNames = config.excludeNames;
      }
      if (config.excludeMatches) {
        excludeMatches = config.excludeMatches;
      }
      if (config.hasOwn !== undefined) {
        hasOwn = config.hasOwn;
      }
      if (config.fakeFunctions) {
        fakeFunctions = config.fakeFunctions;
      }
      if (config.realFunctions) {
        realFunctions = config.realFunctions;
      }
      if (config.includeFunctions) {
        includeFunctions = config.includeFunctions;
      }
      if (config.excludeOnTrue) {
        excludeOnTrue = config.excludeOnTrue;
      }
      if (config.dateAsString) {
        dateAsString = config.dateAsString;
      }
      if (config.drawValue) {
        drawValue = config.drawValue;
      }
      if (config.drawProperty) {
        drawProperty = config.drawProperty;
      }
      if (config.drawObject) {
        drawObject = config.drawObject;
      }
      if (config.drawArray) {
        drawObject = config.drawArray;
      }
      if (config.TAB !== undefined) {
        TAB = config.TAB;
      }
      if (config.PROP_INDENT !== undefined) {
        PROP_INDENT = config.PROP_INDENT;
      }
      if (config.COMMA !== undefined) {
        COMMA = config.COMMA;
      }
    }

    return _processor(
          object,
          parentElements,
          level,
          levelMax,
          propOrIdx);

    function _processor (
            object,
            parentElements,
            level,
            levelMax,
            propOrIdx) {
      if (!isNaN(levelMax) && level >= levelMax) {
        return undefined;
      }

      var i;

      var indent = "";
      if (prettyPrint) {
        for (i = 0; i < level; i++) {
          indent += TAB;
        }
      }

      if (excludeOnTrue) {
        try {
          if (excludeOnTrue(object)) {
            return undefined;
          }
        } catch (ex) {}
      }

      if (typeof render === "function") {
        var rendered = render(object, propOrIdx);
        if (typeof rendered === "string") {
          return jsonString(rendered);
        }
      }

      // indent is used as boolean here!
      if (object instanceof Date) {
        return drawValue(
          indent,
          (!raw || dateAsString) ?
            jsonString(object.toISOString()) : object.valueOf(),
          object);
      } else if (!includeFunctions && typeof object === "function") {
        return undefined;
      } else if (typeof object === "number") {
        return drawValue(indent, String(object), object);
      } else if (typeof object === "string") {
        return drawValue(indent, jsonString(object), object);
      } else if (object === null) {
        return drawValue(indent, "null", object);
      } else if (object === undefined) {
        return raw ? drawValue(indent, "undefined", object) : undefined;
      } else if (typeof object === "boolean") {
        return drawValue(indent, String(object), object);
      }

      if (includeFunctions && typeof object === "function") {
        if (fakeFunctions) {
          return "(function () {})";
        }
      }

      if (includeFunctions && typeof object === "function") {
        if (realFunctions) {
          var out = prettyPrint ? object.toString() : object.toString();
          return drawValue(indent, out, object);
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
          if (excludeInstances && checkIfInstanceOf(object, excludeInstances)) {
            continue;
          }
          if (excludeTypes && checkIfTypeOf(object, excludeTypes)) {
            continue;
          }
          var el;
          try {
            var obj = object[i];
            if (!raw && (obj === undefined)) {
              obj = null;
            }
            el = _processor(obj, parentElements, level, levelMax, i);
          } catch (ex) {
            removeFromArray(object, parentElements);
            return jsonString(String(ex));
          }
          if (el !== undefined) {
            strings.push(el);
          }
        }
        removeFromArray(object, parentElements);
        return drawArray(
          indent, prettyPrint, strings, TAB, COMMA, object, parentElements);
      }

      // else:
      strings = [];
      for (var key in object) {
        var prop = object[key];
        if (hasOwn && !object.hasOwnProperty(key)) {
          continue;
        }
        if (excludeInstances && checkIfInstanceOf(prop, excludeInstances)) {
          continue;
        }
        if (excludeTypes && checkIfTypeOf(prop, excludeTypes)) {
          continue;
        }
        if (excludeNames && checkIfNameOf(key, excludeNames)) {
          continue;
        }
        if (exclude && checkIfExcluded(prop, exclude)) {
          continue;
        }
        if (excludeMatches && checkIfNameMatch(key, excludeMatches)) {
          continue;
        }
        try {
          var objEl =
              _processor(prop, parentElements, level, levelMax, key);
          if (objEl !== undefined) {
            var elString =
              drawProperty(key, object, parentElements, level, PROP_INDENT) + objEl;
            strings.push(elString);
          }
        } catch (ex) {//SOME OBJECT CAN THROW EXCEPTION ON Access, FRAMES ETC.
          removeFromArray(object, parentElements);
          return jsonString(String(ex));
        }
      }
      removeFromArray(object, parentElements);
      return drawObject(
        indent, prettyPrint, strings, TAB, COMMA, object, parentElements);
    }
  };

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
   *   config.renderFunction custom renderer function, must return string,
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
   *   config.level if specified, ho maximally deep
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
    var parentElements = [];
    var level;
    if (config) {
      level = config.level;
    }
    return _serialize(object, config, parentElements, 0, level);
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

clear();
console.log("-------------------------")

console.log(json.serialize([234, ,4,4,3, {a:1,b:{c:2,d:{x:2}, y: new Date(), x:[new Date()]}} ],{TAB: "    ",prettyPrint: true}));

console.log(`[
    234,
    null,
    4,
    4,
    3,
    {
        \"a\": 1,
        \"b\": {
            \"c\": 2,
            \"d\": {
                \"x\": 2
            },
            \"y\": \"2018-02-14T13:48:42.164Z\",
            \"x\": [
                \"2018-02-14T13:48:42.164Z\"
            ]
        }
    }
]`)

console.log("-------------------------")
console.log(json.serialize(
        {a:1,b:{c:2,d:{x:2}, y: new Date(), x:[new Date()]}}, {
  drawVxalue: function (indent, val, object) {
    return String(val);
  },
  prettyPrint: true,
  TAB: "->",
  PROP_INDENT: ":",
  COMMA: ""
}));
console.log("-------------------------")

console.log(json.serialize(
  [234, ,4,4,3, {a:1,b:{c:2,d:{x:2}, y: new Date(), x:[new Date()]}} ],
  {
    TAB: "   ",
    PROP_INDENT: " => ",
    COMMA: " ,",
    prettyPrint: true
  }
));
