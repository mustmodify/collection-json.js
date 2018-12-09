import Item from '../../src/attributes/item.js'
import Collection from '../../src/attributes/collection.js'

let data = null;
let collection = null;

beforeEach( () => {
  data = require("../fixtures/original");
  collection = new Collection(data);
});

test('receives data', () => {
  let item = new Item({data: [{name: 'age', value: '25'}]})
  expect(item.datum('age')['name']).toBe('age')
  expect(item.datum('age')['value']).toBe('25')
})

test('handles not receiving data', () => {
  let item = new Item({});
  expect(item.datum('age')).toBeNull();
})

test('receives links', () => {
  let item = new Item({links: [{"rel" : "blog", "href" : "http://examples.org/blogs/jdoe", "prompt" : "Blog"}]});
  expect(item.link('blog').href).toBe("http://examples.org/blogs/jdoe");
  expect(item.link('blog').prompt).toBe("Blog");
})

test('handles not receiving links', () => {
  let item = new Item({});
  expect(item.link('blog')).toBeNull();
})

test('has an href', () => {
  let item = new Item({href: 'http://www.stuff.test'})
  expect(item.href).toBe("http://www.stuff.test")
})

test('it should iterate items', () => {
  for (let idx in collection.items) {
    let item = collection.items[idx];
    let orig = data.collection.items[idx];
    expect(item.href).toBe(orig.href)
  }
})

test('it should get a value', () => {
  for (let idx in collection.items) {
    var item = collection.items[idx];
    var orig = data.collection.items[idx];
    for (let datum of Array.from(orig.data)) {
      const itemDatum = item.get(datum.name);
      expect(itemDatum).not.toBeNull()
      expect(itemDatum).toBe(datum.value);
    }
  }
})
