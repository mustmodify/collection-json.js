/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const should = require("should");
const fs = require("fs");
const _ = require("underscore");

const cj = require("../src");

describe("Attributes", function() {

  describe("[Original](http://amundsen.com/media-types/collection/)", function() {

    let collection = null;
    let data = null;

    before(() => data = require("./fixtures/original"));

    beforeEach(done=>
      cj.parse(data, function(error, _collection){
        if (error) { throw error; }
        collection = _collection;
        return done();
      })
    );

    describe("[collection](http://amundsen.com/media-types/collection/format/#objects-collection)", function() {
      it("should have a version", () => collection.version.should.equal(data.collection.version));
      it("should have an href", () => collection.href.should.equal(data.collection.href));
      it("should throw an exception with a bad version number", () =>
        cj.parse({collection: {version: "1.1"}}, (error, col)=> should.exist(error, "No error was returned"))
      );
      return it("should throw an exception with a malformed collection", () =>
        cj.parse({version: "1.1"}, (error, col)=> should.exist(error, "No error was returned"))
      );
    });

    describe("[error](http://amundsen.com/media-types/collection/format/#objects-error)", () =>
      it("should have an error", function() {
        const errorData = require("./fixtures/error");
        return cj.parse(errorData, function(error, errorCol){
          should.exist(error, "An error was not returned");
          should.exist(errorCol, "The collection with the error was not returned");

          error.title.should.equal(errorData.collection.error.title);
          error.code.should.equal(errorData.collection.error.code);
          error.message.should.equal(errorData.collection.error.message);

          errorCol.error.title.should.equal(errorData.collection.error.title);
          errorCol.error.code.should.equal(errorData.collection.error.code);
          return errorCol.error.message.should.equal(errorData.collection.error.message);
        });
      })
    );

    describe("[template](http://amundsen.com/media-types/collection/format/#objects-template)", function() {
      it("should iterate properties template", function() {
        const template = collection.template();
        return (() => {
          const result = [];
          for (var key in template.form) {
            const value = template.form[key];
            const orig = _.find(data.collection.template.data, datum=> datum.name === key);
            key.should.equal(orig.name);
            value.should.equal(orig.value);
            result.push(template.promptFor(key).should.equal(orig.prompt));
          }
          return result;
        })();
      });

      it("should be able to set values", function() {
        const newItem = collection.template();
        const name = "Joe Test";
        const email = "test@test.com";
        const blog = "joe.blogger.com";
        const avatar = "http://www.gravatar.com/avatar/dafd213c94afdd64f9dc4fa92f9710ea?s=512";

        newItem.set("full-name", name);
        newItem.set("email", email);
        newItem.set("blog", blog);
        newItem.set("avatar", avatar);

        newItem.get("full-name").should.equal(name);
        newItem.get("email").should.equal(email);
        newItem.get("blog").should.equal(blog);
        return newItem.get("avatar").should.equal(avatar);
      });

      return it("should return a datum given a name", function() {
        const newItem = collection.template();
        const fullName = newItem.datum("full-name");
        fullName.name.should.equal("full-name");
        fullName.prompt.should.equal("Full Name");
        return fullName.value.should.equal("Joe");
      });
    });

    describe("[items](http://amundsen.com/media-types/collection/format/#arrays-items)", function() {
      it("should iterate items", () =>
        (() => {
          const result = [];
          for (let idx in collection.items) {
            const item = collection.items[idx];
            const orig = data.collection.items[idx];
            result.push(item.href.should.equal(orig.href));
          }
          return result;
        })()
      );

      return it("should get a value", () =>
        (() => {
          const result = [];
          for (let idx in collection.items) {
            var item = collection.items[idx];
            var orig = data.collection.items[idx];
            result.push((() => {
              const result1 = [];
              for (let datum of Array.from(orig.data)) {
                const itemDatum = item.get(datum.name);
                should.exist(itemDatum, `Item does not have ${datum.name}`);
                result1.push(itemDatum.should.equal(datum.value));
              }
              return result1;
            })());
          }
          return result;
        })()
      );
    });

    describe("[queries](http://amundsen.com/media-types/collection/format/#arrays-queries)", function() {

      it("should iterate queries", () =>
        (() => {
          const result = [];
          for (var query of Array.from(collection.queries)) {
            const orig = _.find(data.collection.queries, _query=> _query.rel === query.rel);
            query.href.should.equal(orig.href);
            query.rel.should.equal(orig.rel);
            result.push(query.prompt.should.equal(orig.prompt));
          }
          return result;
        })()
      );

      it("should be able to set values", function() {
        const searchQuery = collection.query("search");

        searchQuery.set("search", "Testing");

        return searchQuery.get("search").should.equal("Testing");
      });

      return it("should get a query by rel", () =>
        (() => {
          const result = [];
          for (let orig of Array.from(data.collection.queries)) {
            const searchQuery = collection.query(orig.rel);
            searchQuery.href.should.equal(orig.href);
            searchQuery.rel.should.equal(orig.rel);
            result.push(searchQuery.prompt.should.equal(orig.prompt));
          }
          return result;
        })()
      );
    });

    return describe("[links](http://amundsen.com/media-types/collection/format/#arrays-links)", function() {
      it("should get iterate the links", () =>
        (() => {
          const result = [];
          for (var link of Array.from(collection.links)) {
            const orig = _.find(data.collection.links, _link=> _link.rel === link.rel);
            link.href.should.equal(orig.href);
            link.rel.should.equal(orig.rel);
            result.push(link.prompt.should.equal(orig.prompt));
          }
          return result;
        })()
      );

      return it("should get a link by rel", () =>
        (() => {
          const result = [];
          for (let orig of Array.from(data.collection.links)) {
            const link = collection.link(orig.rel);
            link.href.should.equal(orig.href);
            link.rel.should.equal(orig.rel);
            result.push(link.prompt.should.equal(orig.prompt));
          }
          return result;
        })()
      );
    });
  });

  return describe("[Extensions](https://github.com/mamund/collection-json/tree/master/extensions)", function() {

    describe("[errors](https://github.com/mamund/collection-json/blob/master/extensions/errors.md)", () => it("need tests"));
    describe("[inline](https://github.com/mamund/collection-json/blob/master/extensions/inline.md)", () => it("need tests"));
    describe("[model](https://github.com/mamund/collection-json/blob/master/extensions/model.md)", () => it("need tests"));
    describe("[template-validation](https://github.com/mamund/collection-json/blob/master/extensions/template-validation.md)", () => it("need tests"));
    describe("[templates](https://github.com/mamund/collection-json/blob/master/extensions/templates.md)", () => it("need tests"));
    describe("[uri-templates](https://github.com/mamund/collection-json/blob/master/extensions/uri-templates.md)", () => it("need tests"));
    return describe("[value-types](https://github.com/mamund/collection-json/blob/master/extensions/value-types.md)", () => it("need tests"));
  });
});
