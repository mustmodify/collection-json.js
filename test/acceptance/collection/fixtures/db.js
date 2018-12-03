/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const _ = require("underscore");

const _data = [{
  _id : "task1",
  description : "This is my first task.",
  completed : false,
  dateCreated : "2011-06-01",
  dateDue : "2011-12-31"
}
, {
  _id : "task2",
  description : "This is my second task.",
  completed : true,
  dateCreated : "2011-06-01",
  dateDue : "2011-12-29"
}
, {
  _id : "task3",
  description : "This is my third task.",
  completed : false,
  dateCreated : "2011-06-01",
  dateDue : "2011-11-30"
}
];

let data = _.clone(_data);

module.exports = {
  get(view, options, done){
    if (typeof options === "function") {
      done = options;
      options = {};
    }
    
    switch (view) {
      case "/_design/example/_view/all":
        return done(null, data);
      case "/_design/example/_view/open":
        return done(null, _.filter(data, task=> (task.description != null) && (task.dateCreated != null) && (task.dateDue != null) && (task.completed === false)));
      case "/_design/example/_view/closed":
        return done(null, _.filter(data, task=> (task.description != null) && (task.dateCreated != null) && (task.dateDue != null) && (task.completed === true)));
      case "/_design/example/_view/due_date":
        return done(null, _.filter(data, function(task){
          const due = new Date(task.dateDue);
          const start = due > (options.startDate ? new Date(options.startDate) : 0);
          const end = due < (options.endDate ? new Date(options.endDate) : 9999999999999999);
          return start && end;
        })
        );
      default:
        // it's an item
        return done(null, _.find(data, task=> task._id === view));
    }
  },
  save(doc, done){
    doc._id = `task${data.length+1}`;
    data.push(doc);
    return done(null, doc);
  },
  update(id, doc, done){
    const item = _.find(data, item=> item._id === id);
    if (!item) { return done(new Error("Item not found")); }
    for (let key in doc) {
      const value = doc[key];
      item[key] = value;
    }
    return done(null, item);
  },
  remove(id, done){
    let removed = false;
    data = _.filter(data, function(item){
      const keep = item._id !== id;
      removed = !removed && !keep;
      return keep;
    });
    if (!removed) { return done(new Error(`Item ${id} not found`)); }
    return done(null);
  },

  reset(){
    return data = _.clone(_data);
  },

  _data: data
};
