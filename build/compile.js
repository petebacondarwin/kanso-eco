(function() {
  var async, compile_template, eco, modules, process_folder, utils;

  async = require("async");

  utils = require("kanso-utils/utils");

  modules = require("kanso-utils/modules");

  eco = require("eco");

  module.exports = {
    before: "modules",
    run: function(root, path, settings, doc, callback) {
      var doProcessFolder, doProcessItem, folder, folders, _ref;
      console.log("Running eco pre-compiler");
      if (((_ref = settings["eco"]) != null ? _ref["templates"] : void 0) == null) {
        return callback(null, doc);
      }
      folders = settings["eco"]["templates"];
      if (!Array.isArray(folders)) folders = [folders];
      folders = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = folders.length; _i < _len; _i++) {
          folder = folders[_i];
          _results.push(utils.abspath(folder, path));
        }
        return _results;
      })();
      doProcessItem = async.apply(compile_template, doc, path);
      doProcessFolder = async.apply(process_folder, /.*\.j?eco$/i, doProcessItem);
      return async.forEach(folders, async.apply(doProcessFolder), function(err, doc) {
        return callback(err, doc);
      });
    }
  };

  process_folder = function(pattern, processItem, path, callback) {
    return utils.find(path, pattern, function(err, files) {
      if (err) return callback(err);
      return async.forEach(files, processItem, function(err, doc) {
        return callback(err, doc);
      });
    });
  };

  compile_template = function(doc, path, filename, callback) {
    var name, template;
    name = utils.relpath(filename, path).replace(/\.j?eco$/, "");
    console.log("Compiling " + name);
    template = eco.precompile(fs.readFileSync(filename, 'utf8'));
    modules.add(doc, name, "module.exports = " + template);
    return callback(null, doc);
  };

}).call(this);
