/**
 * Dependencies
 */
var is = require('is');
var match = require('multimatch');
var sm = require('sitemap');

/**
 * Export plugin
 */
module.exports = plugin;

/**
 * Metalsmith plugin for generating a sitemap.
 *
 * @param {String or Object} options
 *   @property {String} changefreq (optional)
 *   @property {String} hostname
 *   @property {String} output (optional)
 *   @property {String} pattern (optional)
 *   @property {String} priority (optional)
 * @return {Function}
 */
function plugin(opts){
  /**
   * Init
   */
  opts = opts || {};

  // Accept string option to specify the hostname
  if (typeof opts === 'string') {
    opts = { hostname: opts };
  }

  // A hostname should be specified
  if (!opts.hostname) {
    throw new Error('"hostname" option required');
  }

  // Map options to local variables
  var changefreq = opts.changefreq;
  var hostname = opts.hostname;
  var output = opts.output || 'sitemap.xml';
  var pattern = opts.pattern || '**/*.html';
  var priority = opts.priority;

  /**
   * Main plugin function
   */
  return function(files, metalsmith, done){
    // Create sitemap object
    var sitemap = sm.createSitemap ({
      hostname: hostname
    });

    // Filter files according to pattern
    function check(file){
      if (!match(file, pattern)[0]) {
        return false;
      }
      return true;
    }

    Object.keys(files).forEach(function(file){
      // Only process files that pass the check
      if (!check(file)) {
        return;
      }

      // Get the current file's frontmatter
      var frontmatter = files[file];

      // Create the sitemap entry
      var url = is.string(frontmatter.canonical) ? frontmatter.canonical : file
      var entry = { url: url };

      // Set changefreq and priority if they were passed
      if (frontmatter.changefreq || changefreq) {
        entry.changefreq = frontmatter.changefreq || changefreq;
      }
      if (frontmatter.priority || priority) {
        entry.priority = frontmatter.priority || priority;
      }

      // Add the entry to the sitemap
      sitemap.add(entry);
    });

    // Create sitemap entry in files
    files[output] = {
      contents: new Buffer(sitemap.toString())
    };

    done();
  };
}