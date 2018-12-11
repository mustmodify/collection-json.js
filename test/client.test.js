import Client from '../src/client.js'

test('throws an error if the cJ version number is unexpected', () => {
  expect.assertions(2);
  Client.parse({collection: {version: "1.1", href: "http://www.stuff.test"}},
    (error, _collection) => {
      expect(error).not.toBeNull()
      expect(error.message).toBe("Collection does not conform to Collection+JSON 1.0 Spec");
  })
})

test('should return an error from the body of the document', () => {
  let data = require("./fixtures/error");

  expect.assertions(2);
  Client.parse(data,
    (error, _collection) => {
      expect(error).not.toBeNull()
      expect(error.message).toBe("The server have encountered an error, please wait and try again.");
  })
})

test('should return an error and no collection if there was a parsing issue', () => {
  expect.assertions(3);

  Client.parse( "in{valid}json",
    (error, _collection) => {
      expect(error).not.toBeNull()
      expect(error.message).toBe("Unexpected token i in JSON at position 0");
      expect( _collection ).toBe(undefined);
  })
})
