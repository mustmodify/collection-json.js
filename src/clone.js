// from https://stackoverflow.com/questions/21003059/how-do-you-clone-an-array-of-objects-using-underscore

export default function clone(thing, opts) {
  var newObject = {};
  if (thing instanceof Array) {
    return thing.map(function (i) { return clone(i, opts); });
  } else if (thing instanceof Date) {
    return new Date(thing);
  } else if (thing instanceof RegExp) {
    return new RegExp(thing);
  } else if (thing instanceof Function) {
    return opts && opts.newFns ?
        new Function('return ' + thing.toString())() :
        thing;
  } else if (thing instanceof Object) {
    Object.keys(thing).forEach(function (key) {
      newObject[key] = clone(thing[key], opts);
    });
    return newObject;
  } else if ([ undefined, null ].indexOf(thing) > -1) {
    return thing;
  } else {
    if (thing.constructor.name === 'Symbol') {
          return Symbol(thing.toString()
                     .replace(/^Symbol\(/, '')
                     .slice(0, -1));
    }
    // return _.clone(thing);  // If you must use _ ;)
    return thing.__proto__.constructor(thing);
  }
}
