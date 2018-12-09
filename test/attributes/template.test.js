import Collection from '../../src/attributes/collection'
import Template from '../../src/attributes/template'

let data = null;
let collection = null;
let template = null;

// http://amundsen.com/media-types/collection/format/#objects-template

beforeEach( () => {
  data = require("../fixtures/original");
  collection = new Collection(data);
  template = collection.template;
});

test('it fails if constructor does not get a URL', () => {
  expect(() => {new Template(null, {})}).toThrow("Template without a target URL")
})

test("should iterate properties of template", () => {
  for (var key in template.form) {
    const value = template.form[key];
    const o_temp_data = data.collection.template.data;
    let orig = o_temp_data.find(datum=> datum.name === key);

    expect(key).toBe(orig.name);
    expect(value).toBe(orig.value);
    expect(template.promptFor(key)).toBe(orig.prompt);
  }
})

test("should be able to set values", () => {
  const newItem = collection.template;

  const name = "Joe Test";
  const email = "test@test.com";
  const blog = "joe.blogger.com";
  const avatar = "http://www.gravatar.com/avatar/dafd213c94afdd64f9dc4fa92f9710ea?s=512";

  newItem.set("full-name", name);
  newItem.set("email", email);
  newItem.set("blog", blog);
  newItem.set("avatar", avatar);

  expect(newItem.get("full-name")).toBe(name);
  expect(newItem.get("email")).toBe(email);
  expect(newItem.get("blog")).toBe(blog);
  expect(newItem.get("avatar")).toBe(avatar);
})

test("it should return a datum given a name", () => {
  const newItem = collection.template;
  const fullName = newItem.datum("full-name");
  expect(fullName.name).toBe("full-name");
  expect(fullName.prompt).toBe("Full Name");
  expect(fullName.value).toBe("Joe");
});
