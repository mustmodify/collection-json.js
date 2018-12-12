import clone from '../clone';
import http from "../http";

import client from "../collection-json";
import Collection from "./collection";
import Link from "./link";
import Template from "./template";

export default class Item
{
   constructor(_item, _template)
   {
     this._item = _item;
     this._template = _template;
     this._links = {}; // will be populated with Links as those are used.
   }

   datum(key)
   {
     let datum = this._item && this._item.data && this._item.data.find(item => item.name === key);
     if(datum)
     {
       // So they don't edit it
       return clone(datum);
     }
     else
     {
        return(null);
     }
   }

   get href() {
      return( this._item.href );
   }

   get(key)
   {
     let datum = this.datum(key);
     return datum && datum.value;
   }

   promptFor(key)
   {
     let datum = this.datum(key);
     return(datum && datum.prompt)
   }

   load(done)
   {
     const options = {};

     return http.get(this._item.href, options, function(error, collection){
       if (error) { return done(error); }
       return client.parse(collection, done);
     });
   }

   links()
   {
     return this._item.links;
   }

   link(rel)
   {
     let link = this._item.links && this._item.links.find(link => link.rel === rel);
     if (!link) { return null; }
     if (link) { this._links[rel] = new Link(link); }
     return this._links[rel];
   }

   edit()
   {
     if (!this._template) { throw new Error("Item does not support editing"); }
     const template = _.clone(this._template);
     template.href = this._item.href;
     return new Template(template, this.data());
   }

   remove(done)
   {
     const options = {};
     return http.del(this._item.href, options, function(error, collection){
       if (error) { return done(error); }
       return client.parse(collection, done);
     });
   }
}
