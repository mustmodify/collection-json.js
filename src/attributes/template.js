import clone from '../clone';
import http from "../http";
import client from "../collection-json";

import collection from "./collection";

export default class Template {
  constructor(href, _template1, form){
    if(href == null || href == undefined || href == "") { throw "Template without a target URL" }
    this.href = href;
    this._template = _template1;
    if (form == null) { form = {}; }
    this.form = form;
    const { _template } = this;
    const _form = this.form;

    if(_template != null && _template != undefined && _template.data)
    {
      _template.data.forEach(function(datum)
      {
        if(_form[datum.name] == null) { _form[datum.name] = datum.value; }
      })
    }
  }

  datum(key){
    if(this._template == null)
    { return null; }
    else
    {
      let datum = this._template.data.find(datum=> datum.name === key);
      return clone(datum);
    }
  }

  get(key){
    return this.form[key];
  }

  set(key, value){
    return this.form[key] = value;
  }

  promptFor(key){
    let d = this.datum(key);
    return(d && d.prompt);
  }

  submit(done){
    if (done == null) { done = function(){}; }
    const form = this.form.map((value, name)=> ({name, value}));

    const options = {
      body: {
        template: {
          data: form
        }
      }
    };

    return http.post(this.href, options, function(error, collection){
      if (error) { return done(error); }
      return client.parse(collection, done);
    });
  }
}
