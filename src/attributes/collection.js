import Link from "./link";
import Item from "./item";
import Query from "./query";
import Template from "./template";

export default class Collection {
  constructor(collection) {
    // Lets verify that it's a valid collection
    if (collection && collection.collection && collection.collection.version !== "1.0") {
      throw new Error("Collection does not conform to Collection+JSON 1.0 Spec");
    }

    this._collection = collection.collection;
    this._items = this._collection.items;
    this._template = null;
    this.error = this._collection.error;
    this.href = this._collection.href;
    this.version = this._collection.version;
    this.links = this._collection.links.map(link => new Link(link));
    this.items = this._collection.items.map(item => new Item(item));
    this.queries = this._collection.queries.map(query => new Query(query));
  }

  link(rel){
    return this.links.find(link=> link.rel === rel);
  }

  item(href){
    return this.items.find(item=> item.href === href);
  }

  query(rel){
    const query = (this._collection.queries||[]).find(query=> query.rel === rel);
    if (!query) { return null; }

    // Don't cache it since we allow you to set parameters and submit it
    return new Query(query);
  }

  template(name){
    return new Template(this._collection.href, this._collection.template);
  }
}
