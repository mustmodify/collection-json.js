/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// 2001-05-25 (mca) : collection+json 
// Designing Hypermedia APIs by Mike Amundsen (2011) 

/*
Module dependencies.
*/

// for express
let host, site;
const express = require("express");
const app = (module.exports = express());

const db = require("./fixtures/db");

// global data
const contentType = "application/json";
module.exports.host = (host = "http://localhost:3000");
module.exports.site = (site = `${host}/collection/tasks`);

// Configuration
app.configure(function() {
  this.set("views", __dirname + "/views");
  this.set("view engine", "cscj");
  // @use express.bodyParser()

  this.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-SessionID, X-UserID");
    if (req.method === 'OPTIONS') { return res.send(200); } else { return next(); }
  });

  this.use(function(req, res, next){
    if (req.get("content-type") === "application/vnd.collection+json") {
      let buf = "";
      req.on("data", chunk=> buf += chunk);
      return req.on("end", function(){
        try {
          req.body = JSON.parse(buf);
          return next();
        } catch (e) {
          e.body = buf;
          e.status = 400;
          return next(e);
        }
      });
    } else {
      return next();
    }
  });

  this.use(express.methodOverride());
  this.use(this.router);

  this.locals.site = site;

  // Make a layout helper
  this.locals.queries = function(collection){
    collection.query(function() {
      this.rel("all");
      this.href(`${site}/;all`);
      return this.prompt("All tasks");
    });
    collection.query(function() {
      this.rel("open");
      this.href(`${site}/;open`);
      return this.prompt("Open tasks");
    });
    collection.query(function() {
      this.rel("closed");
      this.href(`${site}/;closed`);
      return this.prompt("Closed tasks");
    });
    return collection.query(function() {
      this.rel("date-range");
      this.href(`${site}/;date-range`);
      this.prompt("Date Range");
      this.datum({name: "date-start", value: "", prompt: "Start Date"});
      return this.datum({name: "date-stop", value: "", prompt: "Stop Date"});
    });
  };

  this.locals.template = collection=>
    collection.template(function() {
      this.datum({name: "description", value: "", prompt: "Description"});
      this.datum({name: "dateDue", value: "", prompt: "Date Due (yyyy-mm-dd)"});
      return this.datum({name: "completed", value: "", prompt: "Completed (true/false)?"});
    })
  ;

  return this.locals.links = function(collection){
    collection.link({rel: "author", href: "mailto:mamund@yahoo.com", prompt: "Author"});
    collection.link({rel: "profile", href: "http://amundsen.com/media-types/collection/profiles/tasks/", prompt: "Profile"});
    collection.link({rel: "queries", href: `${site}/;queries`, prompt: "Queries"});
    return collection.link({rel: "template", href: `${site}/;template`, prompt: "Template"});
  };
});

// register custom media type as a JSON format
app.configure("development", function() {

  return this.use(function(error, req, res, next){
    console.error(error);

    const status = error.status || 500;

    const collection = { 
      collection: {
        version: "1.0",
        href: `${host}${req.url}`,
        error: {
          code: status,
          title: error.message,
          message: error.stack
        },
        links: []
      }
    };

    return res.send(status, collection);
  });
});

app.configure("production", () => app.use(express.errorHandler()));

// register custom media type as a JSON format
// express.bodyParser.parse["application/collection+json"] = JSON.parse

//#Routes

// handle default task list 
app.get("/collection/tasks", function(req, res, next) {
  const view = "/_design/example/_view/due_date";
  return db.get(view, function(err, doc) {
    if (err) { return next(err); }
    res.set("content-type", contentType);
    return res.render("tasks", {
      href: site,
      tasks: doc
    }
    );
  });
});

// filters
app.get("/collection/tasks/;queries", function(req, res) {
  res.set("content-type", contentType);
  return res.render("queries",
    {href: `${site}/;queries`});
});

app.get("/collection/tasks/;template", function(req, res) {
  res.set("content-type", contentType);
  return res.render("template",
    {href: `${site}/;template`});
});

app.get("/collection/tasks/;all", function(req, res, next) {
  const view = "/_design/example/_view/all";
  return db.get(view, function(err, doc) {
    if (err) { return next(err); }
    res.set("content-type", contentType);
    return res.render("tasks", {
      href: `${site}/;all`,
      tasks: doc
    }
    );
  });
});

app.get("/collection/tasks/;open", function(req, res, next) {
  const view = "/_design/example/_view/open";
  return db.get(view, function(err, doc) {
    if (err) { return next(err); }
    res.set("content-type", contentType);
    return res.render("tasks", {
      href: `${site}/;open`,
      tasks: doc
    }
    );
  });
});

app.get("/collection/tasks/;closed", function(req, res, next) {
  const view = "/_design/example/_view/closed";
  return db.get(view, function(err, doc) {
    if (err) { return next(err); }
    res.set("content-type", contentType);
    return res.render("tasks", {
      href: `${site}/;closed`,
      tasks: doc
    }
    );
  });
});

app.get("/collection/tasks/;date-range", function(req, res, next) {
  const options = {
    startDate: req.query["date-start"],
    endDate: req.query["date-stop"]
  };

  const view = "/_design/example/_view/due_date";
  return db.get(view, options, function(err, doc) {
    if (err) { return next(err); }
    res.set("content-type", contentType);
    return res.render("tasks", {
      href: `${site}/;date-range?date-start=${options.startDate}&date-stop=${options.endDate}`,
      tasks: doc
    }
    );
  });
});

// handle single task item
app.get("/collection/tasks/:i", function(req, res, next) {
  const view = req.params.i;
  return db.get(view, function(err, doc) {
    if (err) { return next(err); }
    res.set("content-type", contentType);
    res.set("etag", doc._rev);
    return res.render("tasks", {
      href: `${site}/${view}`,
      tasks: [doc]
    });
});
});

// handle creating a new task
const addTask = function(req, res, next) {
  let description = undefined;
  let completed = undefined;
  let dateDue = undefined;

  // get data array
  const { data } = req.body.template;
  let i = 0;
  const x = data.length;

  // pull out values we want
  while (i < x) {
    switch (data[i].name) {
      case "description":
        description = data[i].value;
        break;
      case "completed":
        completed = data[i].value;
        break;
      case "dateDue":
        dateDue = data[i].value;
        break;
    }
    i++;
  }

  // build JSON to write
  const item = {};
  item.description = description;
  item.completed = completed;
  item.dateDue = dateDue;
  item.dateCreated = today();

  // write to DB
  return db.save(item, function(err, doc) {
    if (err) {
      err.status = 400;
      return next(err);
    } else {
      return res.redirect(303, site);
    }
  });
};
// We need to handle posting to anywhere we show the template
app.post("/collection/tasks", addTask);
app.post("/collection/tasks/;template", addTask);
app.post("/collection/tasks/;all", addTask);
app.post("/collection/tasks/;closed", addTask);
app.post("/collection/tasks/;open", addTask);
app.post("/collection/tasks/;date-range", addTask);

// handle updating an existing task item 
app.put("/collection/tasks/:i", function(req, res, next) {
  const idx = (req.params.i || "");
  let description = undefined;
  let completed = undefined;
  let dateDue = undefined;

  // get data array
  const { data } = req.body.template;
  let i = 0;
  const x = data.length;

  // pull out values we want
  while (i < x) {
    switch (data[i].name) {
      case "description":
        description = data[i].value;
        break;
      case "completed":
        completed = data[i].value;
        break;
      case "dateDue":
        dateDue = data[i].value;
        break;
    }
    i++;
  }
  // build JSON to write
  const item = {};
  item.description = description;
  item.completed = completed;
  item.dateDue = dateDue;
  item.dateCreated = today();
  return db.update(idx, item, function(err, doc) {
    if (err) {
      err.status = 400;
      return next(err);
    } else {
      // return the same item
      return res.redirect(303, `${site}/collection/tasks/${idx}`);
    }
  });
});

// handle deleting existing task
app.delete("/collection/tasks/:i", function(req, res, next){
  const idx = (req.params.i || "");
  return db.remove(idx, function(err, doc) {
    if (err) {
      err.status = 400;
      return next(err);
    } else {
      res.status = 204;
      return res.send();
    }
  });
});

var today = function() {
  let y = undefined;
  let m = undefined;
  let d = undefined;
  let dt = undefined;
  dt = new Date();
  y = dt.getFullYear();
  m = dt.getMonth() + 1;
  if (m.length === 1) { m = `0${m}`; }
  d = dt.getDate();
  if (d.length === 1) { d = `0${d}`; }
  return y + "-" + m + "-" + d;
};

// Only listen on $ node app.js
if (!module.parent) {
  const port = 3000;
  app.listen(port);
  console.log("Express server listening on port %d", port);
}

