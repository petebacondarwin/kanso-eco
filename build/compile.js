(function() {
  var async, compileTemplate, eco, precompiler, utils;

  utils = require('kanso-utils/utils');

  async = require('async');

  precompiler = require('precompiler-base/precompiler');

  eco = require("eco");

  compileTemplate = function(doc, path, filename, callback) {
    var name, template;
    console.log("Compiling " + filename);
    name = utils.relpath(filename, path).replace(/\.j?eco$/, "");
    template = eco.precompile(fs.readFileSync(filename, 'utf8'));
    precompiler.addModule(doc, name, filename, "module.exports = " + template);
    return callback(null, doc);
  };

  module.exports = {
    after: "precompiler-base",
    before: "properties",
    run: function(root, path, settings, doc, callback) {
      var processTemplate, templatePaths, _ref;
      console.log("Running eco pre-compiler");
      if (((_ref = settings["eco"]) != null ? _ref["templates"] : void 0) == null) {
        return callback(null, doc);
      }
      templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path);
      processTemplate = async.apply(compileTemplate, doc, path);
      console.log("Processing the paths");
      return precompiler.processPaths(templatePaths, /.*\.j?eco$/i, processTemplate, callback);
    }
  };

}).call(this);
