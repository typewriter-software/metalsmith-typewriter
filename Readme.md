
# metalsmith-typewriter

  A Metalsmith plugin to create content from a Typewriter account.

## Installation

    $ npm install metalsmith-typewriter

## Usage

  Install via npm and then add the `metalsmith-markdown` key to your `metalsmith.json` plugins with the username/project/template options.

```json
{
  "plugins": {
    "metalsmith-typewriter": {
      "username": "example_username",
      "project": "example_project",
      "template": "jade",
      "templatesPath": "./src/templates"
    }
  }
}
```

- `username`: Your Typewriter username
- `project`: The Typewriter project you want to pull data from
- `template`: The template extension you are using (e.g. html or jade)
- `templatesPath`: The path to your template directory where the plugin will look for files to use for building each page/type

The plugin looks for valid templates for each page/type based on slug, type name, or project name -- otherwise defaulting to page.jade

The plugin generates markdown and as such depends on the metalsmith-markdown plugin to generate pages, as well as metalsmith-templates.


## Todo
- Use metalsmith layouts, since metalsmith-templates is obsolete
- Remove dependencies on other metalsmith plugins where possible
- Cache fetches unless explicitly indicated
