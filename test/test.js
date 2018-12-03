/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const should = require("should");

const cj = require("..");

describe("Collection+JSON", function() {
  require("./browser");
  require("./node");
  require("./cache");
  return require("./attributes");
});
