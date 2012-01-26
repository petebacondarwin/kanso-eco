{exec} = require 'child_process'
task 'build', 'Build project from src/*.coffee to lib/*.js', ->
  exec 'coffee --compile --output build/ src/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr

task 'watch', 'Watch and build project from src/*.coffee to lib/*.js', ->
  exec 'coffee --watch --compile --output build/ src/', (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
