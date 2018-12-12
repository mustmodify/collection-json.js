import fetch from 'node-fetch';

let content_type = "application/vnd.collection+json";

class HttpImplementation {

  // http_callback is used by each of the verb-methods below.
  // It should call `done` with (error_string_or_null, body_as_text,
  // response_headers)
  //
  http_callback(response, done) {
    if(response.status < 400) {
      // strangely, response.text() returns a promise...
      response.text().then((actual_response) => {
        done(null, actual_response, response.headers)
      })
    }
    else { done(response.status); }
  }

  get(href, options, done) {
    fetch(href).then((response) => {this.http_callback(response, done)}).
      catch(error => done(error));
  };

  post(href, options, done) {
    http_options = Object.assign({}, options,
        {
             method: "POST",        body: JSON.stringify(options.body),
            headers: options.headers,
           redirect: "follow",      mode: "CORS",
        credentials: "same-origin", referrer: "client",
        })

    return(fetch(href, http_options).then(this.http_callback, done));
  };

  put(href, options, done) {
    http_options = Object.assign({}, options,
      {
           method: "PUT",        body: JSON.stringify(options.body),
          headers: headers,
         redirect: "follow",      mode: "CORS",
      credentials: "same-origin", referrer: "client",
      })

    return(fetch(href, http_options).then(this.http_callback, done));
  }

  delete(href, options, done){
    http_options = Object.assign({}, options,
        {
             method: "DELETE",        body: JSON.stringify(options.body),
            headers: headers,
           redirect: "follow",      mode: "CORS",
        credentials: "same-origin", referrer: "client",
        })

    return(fetch(href, http_options).then(http_callback, done));
  };
}

class InterfaceLayer {
  constructor( network_layer )
  {
    if( network_layer == null || network_layer == undefined )
    { this.source = new HttpImplementation(); }
    else
    { this.source = network_layer ; }
  }

  get(href, options, done) {
    if(!options.headers) { options.headers = {} }
    options.headers["accept"] = content_type;

    this.source.get(href, options, function(error, collection, headers) {
      // the previous implementation of this was async, so
      // it might bear reworking once figured out
      // seems like you could add a layer that would try each one
      // and, on failure, try the next.

      if( error || collection )
      {
        // if a collection is returned, the source should handle caching
        // though in the original code...
        // https://github.com/collection-json/collection-json.js/blob/master/lib/http.coffee#L49
        return(done(error, collection, headers));
      }
      else
      {
        return(false);
      }
    })
  }

  post(href, options, done) {
    if (options == null) { options = {}; }
    if (!options.headers) { options.headers = {}; }

    options.headers = Object.assign({}, options.headers, {
      "accept": content_type,
      "content-type": content_type,
      "Content-Type": "application/collection+json; charset=utf-8"
    })

    this.source.post(href, options, function(error, collection, headers)
    {
      if( error || collection )
      {
        // if a collection is returned, the source should handle caching
        // though in the original code...
        // https://github.com/collection-json/collection-json.js/blob/master/lib/http.coffee#L49
        return(done(error, collection, headers));
      }
      else
      {
        return(false);
      }
    })
  }

  put(href, options, done) {
    if (options == null) { options = {}; }
    if (!options.headers) { options.headers = {}; }

    options.headers = Object.assign({}, options.headers, {
      "accept": content_type,
      "content-type": content_type,
      "Content-Type": "application/collection+json; charset=utf-8"
    })

    this.source.put(href, options, function(error, collection, headers)
    {
      if( error || collection )
      {
        // if a collection is returned, the source should handle caching
        // though in the original code...
        // https://github.com/collection-json/collection-json.js/blob/master/lib/http.coffee#L49
        return(done(error, collection, headers));
      }
      else
      {
        return(false);
      }
    })
  }

  delete(href, options, done) {
    if (options == null) { options = {}; }
    if (!options.headers) { options.headers = {}; }

    options.headers = Object.assign({}, options.headers, {
      "accept": content_type,
      "content-type": content_type,
      "Content-Type": "application/collection+json; charset=utf-8"
    })

    this.source.delete(href, options, function(error, collection, headers)
    {
      if( error || collection )
      {
        // if a collection is returned, the source should handle caching
        // though in the original code...
        // https://github.com/collection-json/collection-json.js/blob/master/lib/http.coffee#L49
        return(done(error, collection, headers));
      }
      else
      {
        return(false);
      }
    })
  }
}

export default (new InterfaceLayer())
