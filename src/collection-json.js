import http from "./http";
import Client from "./client";
import fetch from 'node-fetch';

let http_callback = (response) => {
    //should call done with 'error, body-as-json, response headers'
    if(status.ok || status < 400) { done(null, response.json(), response.headers) }
    else { done(response.status); }
  }

http._get = function(href, options, done){
  options.url = href;
  fetch(href).then((response) => http_callback(response)).catch(error => done(error));
};

http._post = function(href, options, done){
  let headers = Object.assign({},
              options.headers,
              {"Content-Type": "application/collection+json; charset=utf-8"},
            )

  http_options = Object.assign({}, options,
      {
           method: "POST",        body: JSON.stringify(options.body),
          headers: headers,
         redirect: "follow",      mode: "CORS",
      credentials: "same-origin", referrer: "client",
      })

    fetch(href, http_options).then(http_callback);
};

http._put = function(href, options, done){
  let headers = Object.assign({},
              options.headers,
              {"Content-Type": "application/collection+json; charset=utf-8"},
            )

  http_options = Object.assign({}, options,
      {
           method: "PUT",        body: JSON.stringify(options.body),
          headers: headers,
         redirect: "follow",      mode: "CORS",
      credentials: "same-origin", referrer: "client",
      })

    fetch(href, http_options).then(http_callback);
};

http._del = function(href, options, done){
  let headers = Object.assign({},
              options.headers,
              {"Content-Type": "application/collection+json; charset=utf-8"},
            )

  http_options = Object.assign({}, options,
      {
           method: "DELETE",        body: JSON.stringify(options.body),
          headers: headers,
         redirect: "follow",      mode: "CORS",
      credentials: "same-origin", referrer: "client",
      })

  fetch(href, http_options).then(http_callback);
};

export default Client;
