/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

let Link;
const http = require("../http");
const client = require("../client");

const Collection = require("./collection");

module.exports = (Link = class Link {
  constructor(_link){
    this._link = _link;
  }

  href() {
    return this._link.href;
  }
  rel() {
    return this._link.rel;
  }
  prompt() {
    return this._link.prompt;
  }

  follow(done){
    if (done == null) { done = function(){}; }
    const options = {};

    return http.get(this._link.href, options, function(error, collection){
      if (error) { return done(error); }
      return client.parse(collection, done);
    });
  }
});
