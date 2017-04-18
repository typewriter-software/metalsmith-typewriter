
var basename = require('path').basename;
var dirname = require('path').dirname;
var extname = require('path').extname;
var axios = require('axios');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys
 * @return {Function}
 */

function plugin(options){
  options = options || {};
  var username = options.username;
  var project = options.project;

  return function(files, metalsmith, done) {
    console.log('metalsmith-typewriter');


    // setImmediate(done);
    // Todo: Use config.username/project
    return axios.get('https://api.typewriter.cloud/' + username + '/' + project)
      .then(function (response) {
        // Convert pages
        response.data.pages.forEach(function (page) {
          var html = page.slug + '.md';
          page.template = 'page.jade';
          page.contents = new Buffer('');
          // Todo -- look for templates based on slug name, type name, project name, otherwise default to page.jade
          page.path = page.slug;
          files[html] = page;
        });

        // Convert types
        Object.keys(response.data.types).forEach(function(typeName) {
          response.data.types[typeName].forEach(function (page) {
            var html = page.slug + '.md';
            page.template = 'page.jade';
            page.contents = new Buffer('');
            page.collection = typeName;
            // Todo -- look for templates based on slug name, type name, project name, otherwise default to page.jade
            page.path = typeName + '/' + page.slug;
            files[html] = page;
          });
        });
        console.log('files')
        console.log(files);
        done();
      })
      .catch(function (error) {
        done(error);
      });


    // Object.keys(files).forEach(function(file){
    //   debug('checking file: %s', file);
    //   if (!markdown(file)) return;
    //   var data = files[file];
    //   var dir = dirname(file);
    //   var html = basename(file, extname(file)) + '.html';
    //   if ('.' != dir) html = dir + '/' + html;
    //
    //   debug('converting file: %s', file);
    //   var str = marked(data.contents.toString(), options);
    //   data.contents = new Buffer(str);
    //   keys.forEach(function(key) {
    //     data[key] = marked(data[key], options);
    //   });
    //
    //   delete files[file];
    //   files[html] = data;
    // });
  };
}
