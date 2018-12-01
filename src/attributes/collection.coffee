import _ from "../underscore"
import http from "../http"
import client from "../client"
import Collection from "./collection"
import Link from "./link.coffee"
import Item from "./item.coffee"
import Query from "./query.coffee"

module.exports = class Collection
  constructor: (collection)->
    # Lets verify that it's a valid collection
    if collection?.collection?.version isnt "1.0"
      throw new Error "Collection does not conform to Collection+JSON 1.0 Spec"

    @_collection = collection.collection
    @_links = null
    @_queries = null
    @_items = null
    @_template = null
    @error = @_collection.error
    @href = @_collection.href
    @version = @_collection.version
    @links = _.map @_collection.links, (link)->
      new Link link
    @items = _.map @_collection.items, (item)->
      new Item item
    @queries = _.map @_collection.queries, (query)->
      new Query query

  link: (rel)->
    _.find @links, (link)-> link.rel is rel

  item: (href)->
    _.find @items, (item)-> item.href is href

  query: (rel)->
    query = _.find @_collection.queries||[], (query)->
      query.rel is rel
    return null if not query

    Query = require "./query.coffee"
    # Don't cache it since we allow you to set parameters and submit it
    new Query query

  # TODO support multiple templates:
  # https://github.com/mamund/collection-json/blob/master/extensions/templates.md

  template: (name)->
    Template = require "./template.coffee"
    new Template @_collection.href, @_collection.template
