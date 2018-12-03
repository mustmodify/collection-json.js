/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Item;
import _ from "../underscore";
import http from "../http";
import client from "../client";
import Collection from "../collection";
import Link from "../link.coffee";
import Template from "../template.coffee";

module.exports = (Item = (function() {
  Item = class Item {
    static initClass() {
  
      this.define("href", {get(){ return this._item.href; }});
    }
    constructor(_item, _template){
      this._item = _item;
      this._template = _template;
      this._links = {};
      this._data = null;
    }

    datum(key){
      const datum = _.find(this._item.data, item=> item.name === key);
      // So they don't edit it
      return _.clone(datum);
    }

    get(key){
      return __guard__(this.datum(key), x => x.value);
    }

    promptFor(key){
      return __guard__(this.datum(key), x => x.prompt);
    }

    load(done){
      const options = {};

      return http.get(this._item.href, options, function(error, collection){
        if (error) { return done(error); }
        return client.parse(collection, done);
      });
    }
    
    links(){
      return this._item.links;
    }

    link(rel){
      const link = _.find(this._item.links||[], link=> link.rel === rel);
      if (!link) { return null; }

      Link = require("./link.coffee");
      if (link) { this._links[rel] = new Link(link); }
      return this._links[rel];
    }

    edit(){
      if (!this._template) { throw new Error("Item does not support editing"); }
      const template = _.clone(this._template);
      template.href = this._item.href;
      return new Template(template, this.data());
    }

    remove(done){
      const options = {};
      return http.del(this._item.href, options, function(error, collection){
        if (error) { return done(error); }
        return client.parse(collection, done);
      });
    }
  };
  Item.initClass();
  return Item;
})());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}