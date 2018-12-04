/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import request from "request";
import http from "./http";
import Client from "./client";

http._get = function(href, options, done){
  options.url = href;
  return request(options, (error, response, body)=> done(error, body, response != null ? response.headers : undefined));
};

http._post = function(href, options, done){
  options.url = href;
  options.body = JSON.stringify(options.body);
  options.method = "POST";
  return request(options, (error, response, body)=> done(error, body, response != null ? response.headers : undefined));
};

http._put = function(href, options, done){
  options.url = href;
  options.body = JSON.stringify(options.body);
  return request.put(options, (error, response)=> done(error, response));
};

http._del = function(href, options, done){
  options.url = href;
  return request.del(options, (error, response)=> done(error, response));
};

export default Client;
