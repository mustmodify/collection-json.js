/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from "./underscore";
import http from "./http";

export default class Client {
  constructor(href, options, done){
    if (typeof options === 'function') {
      done = options;
      options = {};
    }

    return http.get(href, options, function(error, collection){
      if (error) { return done(error); }
      return module.exports.parse(collection, done);
    });
  };

  static parse(collection, done){
    // Throw an error telling the caller it needs a callback for this
    // function to make sense
    let _error, e;
    if ((done == null)) { throw new Error("Callback must be passed to parse"); }

    // Is collection defined?
    if ((collection == null)) {
      return done();
    }

    // If they gave us a string, turn it into an object
    if (typeof collection === "string") {
      try {
        collection = JSON.parse(collection);
      } catch (error1) {
        e = error1;
        e.body = collection;
        console.log(e.body);
        done(e);
      }
    }

    // Create a new Collection
    let collectionObj = null;
    try {
      collectionObj = new module.exports.Collection(collection);
    } catch (error2) {
      e = error2;
      e.body = JSON.stringify(collection);
      return done(e);
    }

    let error = null;
    if (_error = collectionObj.error) {
      error = new Error;
      error.title = _error.title;
      error.message = _error.message;
      error.code = _error.code;
      error.body = JSON.stringify(collection);
    }

    return done(error, collectionObj);
  };
}
