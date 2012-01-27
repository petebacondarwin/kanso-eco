(function() {
  var async, eco, logger, utils;

  utils = require('kanso-utils/utils');

  async = require('async');

  eco = require("eco");

  logger = require('logger');

  module.exports = {
    after: "precompiler-base",
    before: "modules",
    run: function(root, path, settings, doc, callback) {
      var compileTemplate, precompiler, templatePaths, _ref;
      logger.info("Running eco pre-compiler");
      if (!(((_ref = settings["eco"]) != null ? _ref["templates"] : void 0) != null)) {
        logger.warning("No eco template setting found");
        callback(null, doc);
      }
      precompiler = require('precompiler');
      compileTemplate = function(filename, callback) {
        var name, template;
        logger.info("Compiling Eco Template: " + filename);
        name = utils.relpath(filename, path).replace(/\.j?eco$/, "");
        template = eco.precompile(fs.readFileSync(filename, 'utf8'));
        precompiler.addModule(doc, name, filename, "module.exports = " + template);
        return callback(null, doc);
      };
      templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path);
      return precompiler.processPaths(templatePaths, /.*\.j?eco$/i, compileTemplate, callback);
    }
  };

}).call(this);
