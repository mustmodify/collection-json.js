/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const should = require("should");

const cj = require("../..");

describe("Integration", function() {

  const app = require("./collection/app");
  const db = require("./collection/fixtures/db");

  const root = app.site;
  let server = null;

  before(done=>
    server = app.listen(3000, ()=> done())
  );

  after(done=> server.close(()=> done()));

  let rootCollection = undefined;

  beforeEach(done=>
    // db.reset()
    cj(root, function(error, collection){
      if (error) { throw error; }
      should.exist(collection, "No root collection was returned");
      rootCollection = collection;
      return done();
    })
  );

  describe("Original", function() {
    it("should have an href", () => rootCollection.href.should.equal(root));

    it("should have links", function() {
      should.exist(rootCollection.link("queries"), "'queries' links were found");
      return should.exist(rootCollection.link("template"), "'template' link were found");
    });

    it("should follow a link from the root", done=>
      rootCollection.link("queries").follow(function(error, queriesCol){
        if (error) { throw error; }
        should.exist(queriesCol, "No collection was returned");
        should.exist(queriesCol.query("all"), "'all' query is not defined");
        should.exist(queriesCol.query("open"), "'open' query is not defined");
        should.exist(queriesCol.query("closed"), "'closed' query is not defined");
        should.exist(queriesCol.query("date-range"), "'date-range' query is not defined");
        return done();
      })
    );

    it("should submit a query", function(done){
      const query = rootCollection.query("date-range");
      query.set("date-start", "2011-12-01");
      return query.submit(function(error, filteredCol){
        if (error) { throw error; }
        filteredCol.items.length.should.equal(2);
        return done();
      });
    });

    it("should return some items", done=>
      rootCollection.query("all").submit(function(error, itemsCol){
        if (error) { throw error; }
        should.exist(itemsCol, "No collection was returned");
        should.exist(itemsCol.items, "No items were returned in the collection");
        itemsCol.items.length.should.equal(db._data.length);
        for (let i = 0, end = db._data.length-1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
          should.exist(itemsCol.items[i], `Item was not return when requested by index: ${i}`);
          const item = itemsCol.items[i];
          should.exist(item.datum("description"), "Item should have a description");
          should.exist(item.datum("completed"), "Item should have a completed property");
          should.exist(item.datum("dateDue"), "Item should have a dateDue");
          item.get("description").should.equal(db._data[i].description);
          item.get("completed").should.equal(db._data[i].completed);
          item.get("dateDue").should.equal(db._data[i].dateDue);
        }
        return done();
      })
    );

    it("should be able to add an item", done=>
      rootCollection.link("template").follow(function(error, templateCol){
        if (error) { throw error; }
        const template = templateCol.template();
        template.set("description", "This is a test");
        template.set("dueDate", "2012-10-06");
        template.set("completed", false);

        const expectedLength = db._data.length+1;

        return template.submit(function(error){
          if (error) { throw error; }
          db._data.length.should.equal(expectedLength);

          return rootCollection.query("all").submit(function(error, itemsCol){
            itemsCol.items.length.should.equal(expectedLength);
            return done();
          });
        });
      })
    );


    it("should edit an item");
  //     rootCollection.query("all").submit (error, items)->
  //       throw error if error
  //       items.item(0).load (error, itemCol)->
  //         throw error if error

  //         template = itemCol.item(0).edit()
  //         template.set "description", "Testing123"

  //         template.submit (error, itemColNew)->
  //           itemColNew.item(0).datum("description").should.equal "Testing123"
  //           done()
    return it("should follow an item's link");
  });

  return describe("Extensions", () => it("should validate client input"));
});

  //
  //   it "should read [template collection](https://github.com/mamund/collection-json/blob/master/extensions/templates.md)"
  //   it "should submit [template collection](https://github.com/mamund/collection-json/blob/master/extensions/templates.md)"
  //   it "should [validate template input](https://github.com/mamund/collection-json/blob/master/extensions/template-validation.md)"

