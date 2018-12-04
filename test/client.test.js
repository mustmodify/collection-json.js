import Client from '../src/client.js'

// Pass these from beforeEach to tests
let data = null;
let collection = null;

beforeEach( () => {
  let data = require("./fixtures/original");
  Client.parse(data, function(error, _collection) {
    if( error ) { throw error };
    collection = _collection;
  });
});

test('throws an error if the cJ version number is unexpected', () => {
  expect.assertions(1);
  Client.parse({collection: {version: "1.1", href: "http://www.stuff.test"}},
    (error, _collection) => {
      expect(error.message).toBe("Collection does not conform to Collection+JSON 1.0 Spec");
  })
})
