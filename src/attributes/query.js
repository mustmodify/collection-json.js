import _ from "../underscore";
import http from "../http";
import client from "../client";
import Collection from "./collection";

export default class Query
{
   constructor(_query_in, form_in)
   {
     this._query = _query_in;
     this.form = form_in || {}

     const { _query } = this;
     const _form = this.form;

     _query.data.forEach(datum => {
       if ((_form[datum.name] == null)) { _form[datum.name] = datum.value; }
     });

   }

   get href() {
     return this._query.href;
   }

   get rel() {
     return this._query.rel;
   }

   get prompt() {
     return this._query.prompt;
   }

   datum(key){
     const datum = this._query.data.find(datum => datum.name === key);
     return _.clone(datum);
   }

   get(key){
     return this.form[key];
   }

   set(key, value){
     return this.form[key] = value;
   }

   promptFor(key){
     let datum = this.datum(key);
     return( datum && datum.prompt );
   }

   submit(done){
     if (done == null) { done = function(){}; }
     const options =
       {qs: this.form};

     return http.get(this._query.href, options, function(error, collection){
       if (error) { return done(error); }
       return client.parse(collection, done);
     });
   }
}
