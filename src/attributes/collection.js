import Link from "./link";
import Item from "./item";
import Query from "./query";
import Template from "./template";

export default class Collection {
  constructor(collection) {
    // Lets verify that it's a valid collection
    if (__guard__(collection != null ? collection.collection : undefined, x => x.version) !== "1.0") {
      throw new Error("Collection does not conform to Collection+JSON 1.0 Spec");
    }

    this._collection = collection.collection;
    this._items = this._collection.items;
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

    // Don't cache it since we allow you to set parameters and submit it
    return new Query(query);
  }

  template(name){
    return new Template(this._collection.href, this._collection.template);
  }
}
