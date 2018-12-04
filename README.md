Collection+JSON Client for JavaScript [![Build Status](https://secure.travis-ci.org/collection-json/collection-json.js.png)](http://travis-ci.org/collection-json/collection-json.js)
=====================================

Fork Notes
----------

Test me with:

```
npx mocha test/attributes.js --compilers js:babel-core/register
```

Create dist file with:

```
npx webpack
```


Features
--------

* Simple API
* Node.js and Browser compatible
* Query/Template building
* HTTP client
* Built in caching with the ability to add a custom backend (Memory, LocalStorage, Memcache, Redis, Riak, etc)


Example
-------

```js
var cj = require("collection-json");

// Start at the root of our api
cj("http://example.com", function(error, collection){

  // We get back a collection object
  // Let's follow the 'users' link
  collection.link('users').follow(function(error, collection){

    // Print out the current users
    console.log(collection.items);

    // Lets get a list of addresses from the first user we got back
    collection.items[0].link('addresses').follow(function(error, collection){

      // Let's add a new address from the template
      var template = collection.template();
      template.set('street', '123 Fake Street');

      // Submit our new template
      template.submit(function(error, collection){
        if (!error)
          console.log("Added a new address!!!");

      });
    });
  });
});
```
