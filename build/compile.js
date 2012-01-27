(function() {

  module.exports = {
    before: "modules",
    run: function(root, path, settings, doc, callback) {
      var async, compileTemplate, eco, precompiler, templatePaths, utils, _ref;
      if (!(((_ref = settings["eco"]) != null ? _ref["templates"] : void 0) != null)) {
        console.log("No eco template setting found");
        callback(null, doc);
      }
      utils = require('kanso-utils/utils');
      async = require('async');
      eco = require("eco");
      precompiler = require('./precompiler');
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
