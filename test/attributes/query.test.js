import Query from '../../src/attributes/item.js'
import Collection from '../../src/attributes/collection'
import Template from '../../src/attributes/template'

let data = null;
let collection = null;

describe("Query", () => {
  beforeEach(() => {
    data = require("../fixtures/original");
    collection = new Collection(data);
  });

  test("it should iterate queries", () => {
    for (var query of Array.from(collection.queries)) {
      const orig = data.collection.queries.find( _query => _query.rel === query.rel);
      expect(query.href).toBe(orig.href);
      expect(query.rel).toBe(orig.rel);
      expect(query.prompt).toBe(orig.prompt);
    }
  })

  test("It should be able to set query values", () => {
    const searchQuery = collection.query("search");
    searchQuery.set("search", "Testing");
    expect(searchQuery.get("search")).toBe("Testing");
  })

  test("It should get a query by rel", () => {
    for (let orig of Array.from(data.collection.queries)) {
      const searchQuery = collection.query(orig.rel);
      expect(searchQuery.href).toBe(orig.href);
      expect(searchQuery.rel).toBe(orig.rel);
      expect(searchQuery.prompt).toBe(orig.prompt);
    }
  })
});
