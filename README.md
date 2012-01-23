# Eco Template Precompiler

This package will precompile Eco templates and adds them to the design document as CommonJS modules that you can use in your applications.

## Eco Templating

Eco templates run coffeescript directly in your templates.  Check out Sam Stephenson's repository for more information: https://github.com/sstephenson/eco.


## To use

Add `eco`, `modules` to your dependencies in `kanso.json`.

    "dependencies": {
        ...
        "eco": null,
        "modules": null
    }

Add an `eco` field to `kanso.json` with a list of folders to search for eco templates.

    "eco": {
        "templates": ["templates"]
    },

The Eco precompiler compiles the eco template into a CommonJS module that you can require and run to render:

    var template = require('templates/mytemplate');
    vat some_object = { name: "Pete", greeting: "Hello" };
    var rendered_html = template(some_object);

