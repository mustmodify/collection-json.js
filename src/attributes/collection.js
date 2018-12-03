/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from "../underscore";
import http from "../http";
import client from "../client";
import Collection from "./collection";
import Link from "./link.coffee";
import Item from "./item.coffee";
import Query from "./query.coffee";

module.exports = (Collection = class Collection {
  constructor(collection){
    // Lets verify that it's a valid collection
    if (__guard__(collection != null ? collection.collection : undefined, x => x.version) !== "1.0") {
      throw new Error("Collection does not conform to Collection+JSON 1.0 Spec");
    }

    this._collection = collection.collection;
    this._links = null;
    this._queries = null;
    this._items = null;
    this._template = null;
    this.error = this._collection.error;
    this.href = this._collection.href;
    this.version = this._collection.version;
    this.links = _.map(this._collection.links, link=> new Link(link));
    this.items = _.map(this._collection.items, item=> new Item(item));
    this.queries = _.map(this._collection.queries, query=> new Query(query));
  }

  link(rel){
    return _.find(this.links, link=> link.rel === rel);
  }

  item(href){
    return _.find(this.items, item=> item.href === href);
  }

  query(rel){
    const query = _.find(this._collection.queries||[], query=> query.rel === rel);
    if (!query) { return null; }

    Query = require("./query.coffee");
    // Don't cache it since we allow you to set parameters and submit it
    return new Query(query);
  }

  // TODO support multiple templates:
  // https://github.com/mamund/collection-json/blob/master/extensions/templates.md

  template(name){
    const Template = require("./template.coffee");
    return new Template(this._collection.href, this._collection.template);
  }
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}