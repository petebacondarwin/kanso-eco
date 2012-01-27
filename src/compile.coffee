module.exports =
  before: "modules"
  run: (root, path, settings, doc, callback) ->
    if not settings["eco"]?["templates"]?
       console.log "No eco template setting found"
       callback(null, doc)

    utils = require('kanso-utils/utils')
    async = require('async')
    eco  = require("eco")
    precompiler = require('precompiler')

    compileTemplate = (filename, callback) ->
      console.log "Compiling Eco Template: " + filename

      # Make template filename relative and Strip off the extension
      name = utils.relpath(filename, path).replace(/\.j?eco$/, "")
      
      # Compile the template
      template = eco.precompile(fs.readFileSync filename, 'utf8')
      
      # Add the compiled template to the design document
      precompiler.addModule(doc, name, filename, "module.exports = #{template}")

      # Tell the caller that the template has been compiled
      callback(null, doc)


    console.log "Running eco pre-compiler"
    # Extract the template paths from the settings
    templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path)

    # Run processTemplate, asynchronously, on each of the files that match the given pattern, in the given paths 
    precompiler.processPaths(templatePaths, /.*\.j?eco$/i, compileTemplate, callback)

