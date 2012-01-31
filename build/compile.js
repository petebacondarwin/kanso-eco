(function() {
  var async, eco, precompiler, utils;

  async = require('async');

  utils = require('kanso-utils/utils');

  precompiler = require('kanso-precompiler-base');

  eco = require("eco");

  module.exports = {
    before: "modules",
    run: function(root, path, settings, doc, callback) {
      var compileTemplate, templatePaths, _ref;
      if (((_ref = settings["eco"]) != null ? _ref["templates"] : void 0) == null) {
        console.log("No eco template setting found");
        return callback(null, doc);
      }
      compileTemplate = function(filename, callback) {
        var name, template;
        name = utils.relpath(filename, path).replace(/\.j?eco$/, "");
        console.log("Compiling Eco Template: " + name);
        template = eco.precompile(fs.readFileSync(filename, 'utf8'));
        precompiler.addModule(doc, name, filename, "module.exports = " + template);
        return callback(null, doc);
      };
      console.log("Running eco pre-compiler");
      templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path);
      return precompiler.processPaths(templatePaths, /.*\.j?eco$/i, compileTemplate, callback);
    }
  };

}).call(this);
