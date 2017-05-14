
var basename = require('path').basename;
var dirname = require('path').dirname;
var extname = require('path').extname;
var axios = require('axios');
var fs = require('fs');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to feed Typewriter CMS content into the Metalsmith pipeline.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){
  options = options || {};
  var username = options.username;
  var project = options.project;
  var template = options.template || 'jade';
  var templatesPath = options.templatesPath || './src/templates';

  return function(files, metalsmith, done) {
    console.log('metalsmith-typewriter');


    // setImmediate(done);
    var url = 'https://api.typewriter.cloud/' + username + '/' + project;
    // var url = 'http://127.0.0.1:5000/projectData.json';
    return axios.get(url)
      .then(function (response) {
        // Convert pages
        response.data.pages.forEach(function (page) {
          var html = page.slug + '.md';

          // Look for templates based on slug name, project name, otherwise default to page.jade
          if (fs.existsSync(metalsmith.path(templatesPath, page.slug + '.' + template))) {
            page.template = page.slug + '.' + template;
          } else if (fs.existsSync(metalsmith.path(templatesPath, page.project + '.' + template))) {
            page.template = page.project + '.' + template;
          } else {
            page.template = 'page.' + template;
          }

          page.contents = new Buffer('');
          page.path = page.slug;
          files[html] = page;
        });

        // Convert types
        Object.keys(response.data.types).forEach(function(typeName) {
          response.data.types[typeName].forEach(function (type) {
            var html = type.slug + '.md';
            type.contents = new Buffer('');
            type.collection = typeName;

            // Look for templates based on slug name, type name, project name, otherwise default to type.jade
            if (fs.existsSync(metalsmith.path(templatesPath, type.slug + '.' + template))) {
              type.template = type.slug + '.' + template;
            } else if (fs.existsSync(metalsmith.path(templatesPath, typeName + '.' + template))) {
              type.template = type.project + '.' + template;
            } else if (fs.existsSync(metalsmith.path(templatesPath, type.project + '.' + template))) {
              type.template = type.project + '.' + template;
            } else {
              type.template = 'type.' + template;
            }

            type.path = typeName + '/' + type.slug;
            files[html] = type;
          });
        });
        done();
      })
      .catch(function (error) {
        done(error);
      });
  };
}
