/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import _ from "../underscore";
import http from "../http";
import client from "../client";
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

    _.each((_template != null ? _template.data : undefined) || [], function(datum){
      if ((_form[datum.name] == null)) { return _form[datum.name] = datum.value; }
    });
  }

  datum(key){
    const datum = _.find((this._template != null ? this._template.data : undefined) || [], datum=> datum.name === key);
    return _.clone(datum);
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
    const form = _.map(this.form, (value, name)=> ({name, value}));

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
