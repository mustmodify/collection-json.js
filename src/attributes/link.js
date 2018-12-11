import http from '../http';
import Client from '../client';
import Collection from "./collection";

export default class Link {
  constructor(_link){
    this._link = _link;
  }

  get href() {
    return (this._link && this._link.href || null);
  }
  get rel() {
    return (this._link && this._link.rel || null);
  }
  get prompt() {
    return (this._link && this._link.prompt || null);
  }

  follow(done){
    if (done == null) { done = function(){}; }
    const options = {};

    return http.get(this._link.href, options, function(error, collection){
      if (error) { return done(error); }
      return Client.parse(collection, done);
    });
  }
}
