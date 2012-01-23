async = require("async")
utils = require("kanso-utils/utils")
modules = require("kanso-utils/modules")
eco  = require("eco")

module.exports =
  before: "modules"
  run: (root, path, settings, doc, callback) ->
    console.log "Running eco pre-compiler"
    return callback(null, doc)  unless settings["eco"]?["templates"]?

    folders = settings["eco"]["templates"]
    folders = [ folders ] unless Array.isArray(folders)   # Ensure folders is an array
    folders = for folder in folders     # Convert folders to absolute path
                utils.abspath(folder, path)

    # Create a continuation that processes a template using the given doc and path
    doProcessItem = async.apply(compile_template, doc, path)
    doProcessFolder = async.apply(process_folder, /.*\.j?eco$/i, doProcessItem)

    # Process the folders asynchronously
    async.forEach(folders, async.apply(doProcessFolder), (err,doc)->callback(err, doc))

process_folder = (pattern, processItem, path, callback) ->
  utils.find path, pattern, (err, files) ->
    return callback(err) if err 
    # Process the files asynchronously
    async.forEach(files, processItem, (err, doc)-> callback(err, doc))

compile_template = (doc, path, filename, callback) ->
  name = utils.relpath(filename, path).replace(/\.j?eco$/, "")
  console.log "Compiling " + name
  template = eco.precompile(fs.readFileSync filename, 'utf8')
  modules.add(doc, name, "module.exports = #{template}")
  # Pass the updated document back up the call stack
  callback(null, doc)