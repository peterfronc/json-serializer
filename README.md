json-serializer
===============

The purpose of this library is to have a generic object serialization tool that is JSON compatible (by default).
Apart from `JSON.stringify(object)` compatible `json.serialize(object)` function, `json.serialize` can be passed with config options `json.serialize(object, config)`, which properties can be described:

 * excludedInstances=undefined Array of instances that will be excluded from object tree elements (instanceof check)
 * level=undefined Level number (>=1) that serializer should not go below
 * excludedTypes=undefined Array of types that will be excluded from object tree elements (typeof check)
 * excludedNames=undefined Array of property names that will be excluded from object tree elements
 * own=undefined If use hasOwnProperty should be used while checking if object property will be added
 * excludeOnTrue=undefined function reference that will be used to decide which elements will be included
 * dateAsString=true How date will be returned
 * raw = false dont use "json" standard output and serialize real values (undefines, dates as numbers etc)
 * includeFunctions=false if functions will be ignored or not, if not, they will be treated like objects
 * fakeFunctions = false if includeFunctions is used, this options tell to return blank function instead of traversing it as object
 * realFunctions = false if includeFunctions is used, functions will be returned as their "toString()" values
 * prettyPrint=false return output "prettyfied", it does not prettify functions contents.

By default json.serialize(object) will output normal JSON, same as known JSON.stringify.

`json` have following features:

* does not pollute Object.prototype - it is simple static function
* implementation is very minimal and kept simple (feel free to commit to work)
* delivers function `json.parse` which is a similar method to `JSON.parse`, with a simpler regex used.

If you have any queries or sugesstions please write to peter.fronc@qubitproducts.com



