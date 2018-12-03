/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const http = require("../lib/http");
const { angular } = window;
const client = require("../lib/client");

const cj = angular.module("collection-json", []);

cj.factory("collection-json", [
  "$http",

  function($http){
    http._get = function(href, options, done){
      // Rename things for angular
      options.params = options.qs;
      return $http.get(href, options)
        .success((data, status, headers, config)=> done(null, data, headers))
        .error(function(data, status, headers, config){
          let error = null;
          if (status === 0) {
            error = new Error;
            error.code = 0;
            error.title = "Could not connect to the specified host";
            error.message = "Make sure the specified host exists and is working properly";
          }

          return done(error, data, headers);
        });
    };


    http._post = function(href, options, done){};

    http._put = function(href, options, done){};

    http._del = function(href, options, done){};

    return client;
  }
]);
