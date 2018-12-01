import request from "request"
import http from "./http.coffee"
import Client from "./client.coffee"

http._get = (href, options, done)->
  alert('GETTING');
  options.url = href
  request options, (error, response, body)->
    done error, body, response?.headers

http._post = (href, options, done)->
  options.url = href
  options.body = JSON.stringify options.body
  options.method = "POST"
  request options, (error, response, body)->
    done error, body, response?.headers

http._put = (href, options, done)->
  options.url = href
  options.body = JSON.stringify options.body
  request.put options, (error, response)->
    done error, response

http._del = (href, options, done)->
  options.url = href
  request.del options, (error, response)->
    done error, response

export default Client;
