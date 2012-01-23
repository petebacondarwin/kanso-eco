# Eco Template Precompiler

## To use

Add `eco` to your dependencies in `kanso.json`.

    "dependencies": {
        ...
        "eco": null
    }

Add an `eco` field to `kanso.json` with a list of folders to search for eco templates.

    "eco": {
        "templates": ["templates"]
    },

The precompiler compiles the eco template into a javascript function that you can require and run to render:

    var template = require('templates/mytemplate');
    vat some_object = { name: "Pete", greeting: "Hello" };
    var rendered_html = template(some_object);