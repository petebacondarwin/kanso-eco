utils = require('kanso-utils/utils')
async = require('async')
precompiler = require('./precompiler')
eco  = require("eco")

compileTemplate = (doc, path, filename, callback) ->
  console.log "Compiling " + filename

  # Make template filename relative and Strip off the extension
  name = utils.relpath(filename, path).replace(/\.j?eco$/, "")
  
  # Compile the template
  template = eco.precompile(fs.readFileSync filename, 'utf8')
  
  # Add the compiled template to the design document
  precompiler.addModule(doc, name, filename, "module.exports = #{template}")

  # Tell the caller that the template has been compiled
  callback(null, doc)


module.exports =
  before: "modules"
  run: (root, path, settings, doc, callback) ->
    console.log "Running eco pre-compiler"
    return callback(null, doc) unless settings["eco"]?["templates"]?

    # Extract the template paths from the settings
    templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path)

    # Create a continuation that processes a template using the given doc and path
    processTemplate = async.apply(compileTemplate, doc, path)

    console.log "Processing the paths"
    # Run processTemplate, asynchronously, on each of the files that match the given pattern, in the given paths 
    precompiler.processPaths(templatePaths, /.*\.j?eco$/i, processTemplate, callback)

