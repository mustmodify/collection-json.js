import Link from '../../src/attributes/link.js'
import Collection from '../../src/attributes/collection.js'

let data = null;
let collection = null;

beforeEach( () => {
  data = require("../fixtures/original");
  collection = new Collection(data);
});

test('receives data', () => {
  let link = new Link({href: 'http://www.trek.com/picard', rel: 'Captain', prompt: "Ship Leader"})
  expect(link.href).toBe('http://www.trek.com/picard')
  expect(link.rel).toBe('Captain')
  expect(link.prompt).toBe('Ship Leader')
})

test('handles not receiving data', () => {
  let link = new Link({});
  expect(link).not.toBeNull()
  expect(link.href).toBeNull();
  expect(link.rel).toBeNull();
  expect(link.prompt).toBeNull();
})
