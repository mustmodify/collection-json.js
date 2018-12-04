/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from "../underscore";
import http from "../http";
import client from "../client";
import Collection from "./collection";

export default class Query
{
   constructor(_query1, form)
   {
     this._query = _query1;
     if (form == null) { form = {}; }
     this.form = form;
     const { _query } = this;
     const _form = this.form;

     _query.data.forEach(datum => {
       if ((_form[datum.name] == null)) { return _form[datum.name] = datum.value; }
     });
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
