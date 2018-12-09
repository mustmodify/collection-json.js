import Collection from '../../src/attributes/collection'
import Template from '../../src/attributes/template'

let data = null;
let collection = null;

beforeEach( () => {
  data = require("../fixtures/original");
  collection = new Collection(data);
});

test('it should have a versoin', () => {
  expect( collection.version ).toBe( '1.0' )
})

test('it should have an href', () => {
  expect( collection.href ).toBe( 'http://example.org/friends/' )
})

test('it should have errors, when appropriate', () => {
  let err = new Collection(require('../fixtures/error'));
  expect( err.error ).not.toBeNull();
  expect( err.error.title ).toBe("Server Error");
  expect( err.error.code ).toBe("X1C2");
  expect( err.error.message ).toBe("The server have encountered an error, please wait and try again.");
});

test('it provides blank attributes', () => {
  let min_data = require("../fixtures/minimalist");

  let minimal = new Collection(min_data);

  expect(minimal.items).toHaveLength(0);
  expect(minimal.template).toBeNull();
  expect(minimal.links).toHaveLength(0);
  expect(minimal.queries).toHaveLength(0);
})

test('can has template items', () => {
  expect(collection.template).toBeInstanceOf(Template);
});

test('Can get a link by rel', () => {
  let link = collection.link('feed');
  expect(link.href).toBe('http://example.org/friends/rss');
  expect(link.rel).toBe('feed');
  expect(link.prompt).toBe('Feed');
});
