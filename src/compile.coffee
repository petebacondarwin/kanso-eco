utils = require('kanso-utils/utils')
precompiler = require('kanso-precompiler-base')
eco  = require("eco")

module.exports =
  before: "modules"
  run: (root, path, settings, doc, callback) ->
    # Check the settings are valid
    unless settings["eco"]?["templates"]?
      console.log "No eco template setting found"
      return callback(null, doc)

    compileTemplate = (filename, callback) ->
      # Make template filename relative and Strip off the extension
      name = utils.relpath(filename, path).replace(/\.j?eco$/, "")
      console.log "Compiling Eco Template: " + name      
      # Compile the template
      template = eco.precompile(fs.readFileSync filename, 'utf8')
      # Add the compiled template to the design document
      precompiler.addModule(doc, name, filename, "module.exports = #{template}")
      # Tell the caller that the template has been compiled without error
      callback(null)

    console.log "Running eco pre-compiler"
    # Extract the template paths from the settings
    templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path)

    # Run processTemplate, asynchronously, on each of the files that match the given pattern, in the given paths 
    precompiler.processPaths(templatePaths, /.*\.j?eco$/i, compileTemplate, (err)->callback(err,doc))

