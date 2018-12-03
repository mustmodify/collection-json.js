/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

let defaults;
module.exports = (defaults = {
  _get(href, options, done){
    if (done == null) { done = function(){}; }
    return done(new Error("'GET' not implemented"));
  },

  _post(href, options, done){
    if (done == null) { done = function(){}; }
    return done(new Error("'POST' not implemented"));
  },

  _put(href, options, done){
    if (done == null) { done = function(){}; }
    return done(new Error("'PUT' not implemented"));
  },

  _del(href, options, done){
    if (done == null) { done = function(){}; }
    return done(new Error("'DELETE' not implemented"));
  },

  cache: {
    // This is a fake cache. You should probably add a real one...
    put(key, value, time, done){
      if (done == null) { done = function(){}; }
      if (typeof time === 'function') {
        done = time;
        time = null;
      }
      return done();
    },
    del(key, done){
      if (done == null) { done = function(){}; }
      return done();
    },
    clear(done){
      if (done == null) { done = function(){}; }
      return done();
    },
    get(key, done){
      if (done == null) { done = function(){}; }
      return done();
    },
    size(done){
      if (done == null) { done = function(){}; }
      return done(0);
    },
    memsize(done){
      if (done == null) { done = function(){}; }
      return done(0);
    },
    debug(){
      return true;
    }
  }
});

module.exports["content-type"] = "application/vnd.collection+json";

module.exports.get = (href, options, done)=>
  defaults.cache.get(href, function(error, collection){
    // Give them the cached stuff if we have it
    if (error || collection) { return done(error, collection); }

    if (!options.headers) { options.headers = {}; }
    options.headers["accept"] = module.exports["content-type"];

    module.exports.setOptions(href, options);

    return defaults._get(href, options, function(error, collection, headers){
      if (error) { return done(error); }
      performCache(collection, headers);
      return done(error, collection);
    });
  })
;

module.exports.post = function(href, options, done){

  if (options == null) { options = {}; }
  if (!options.headers) { options.headers = {}; }
  options.headers["accept"] = module.exports["content-type"];
  options.headers["content-type"] = module.exports["content-type"];

  module.exports.setOptions(href, options);
  
  return defaults._post(href, options, (error, collection, headers)=>
    // Do we cache this?
    done(error, collection)
  );
};

// Should be overridden by the client
module.exports.setOptions = function(href, options){};

var performCache = function(collection, headers){};
  // Expires
  // expires = response.headers.expires
  // # TODO convert to time-from-now
  // # Cache-Control
  // # TODO implement
  // defaults.cache.put response.request.href, response.body, new Date(expires).getTime() if expires
