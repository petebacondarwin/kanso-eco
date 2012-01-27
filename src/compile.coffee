utils = require('kanso-utils/utils')
async = require('async')
eco  = require("eco")
logger = require('logger')

module.exports =
  after: "precompiler-base"
  before: "modules"
  run: (root, path, settings, doc, callback) ->
    logger.info "Running eco pre-compiler"

    if not settings["eco"]?["templates"]?
       logger.warning "No eco template setting found"
       callback(null, doc)

    precompiler = require('precompiler')

    compileTemplate = (filename, callback) ->
      logger.info "Compiling Eco Template: " + filename

      # Make template filename relative and Strip off the extension
      name = utils.relpath(filename, path).replace(/\.j?eco$/, "")
      
      # Compile the template
      template = eco.precompile(fs.readFileSync filename, 'utf8')
      
      # Add the compiled template to the design document
      precompiler.addModule(doc, name, filename, "module.exports = #{template}")

      # Tell the caller that the template has been compiled
      callback(null, doc)


    # Extract the template paths from the settings
    templatePaths = precompiler.normalizePaths(settings["eco"]["templates"], path)

    # Run processTemplate, asynchronously, on each of the files that match the given pattern, in the given paths 
    precompiler.processPaths(templatePaths, /.*\.j?eco$/i, compileTemplate, callback)

