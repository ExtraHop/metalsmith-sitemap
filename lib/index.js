/**
 * Dependencies
 */
var is = require('is');
var match = require('multimatch');
var path = require('path');
var S = require('string');
var sm = require('sitemap');

/**
 * Export plugin
 */
module.exports = plugin;

/**
 * Metalsmith plugin for generating a sitemap.
 *
 * @param {String or Object} options
 *   @property {Date} lastmod (optional)
 *   @property {String} changefreq (optional)
 *   @property {Boolean} omitExtension (optional)
 *   @property {Boolean} omitIndex (optional)
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

  // Map options to local variables and set defaults
  var changefreq = opts.changefreq;
  var hostname = opts.hostname;
  var lastmod = opts.lastmod;
  var omitExtension = opts.omitExtension;
  var omitIndex = opts.omitIndex;
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
      return match(file, pattern)[0];
    }

    // Build an url
    function buildUrl(file, frontmatter){
      // Frontmatter settings take precedence
      if (is.string(frontmatter.canonical)) {
        return frontmatter.canonical;
      }

      // Remove index.html if necessary
      if (omitIndex && path.basename(file) === 'index.html') {
        return S(file).chompRight('index.html').s;
      }

      // Remove extension if necessary
      if (omitExtension) {
        return S(file).chompRight(path.extname(file)).s;
      }

      // Otherwise just use 'file'
      return file;
    }

    Object.keys(files).forEach(function(file){
      // Only process files that pass the check
      if (!check(file)) {
        return;
      }

      // Get the current file's frontmatter
      var frontmatter = files[file];

      // Create the sitemap entry
      var entry = {
        url: buildUrl(file, frontmatter)
      };

      // Set changefreq, priority and lastmod if they were passed
      if (frontmatter.changefreq || changefreq) {
        entry.changefreq = frontmatter.changefreq || changefreq;
      }
      if (frontmatter.priority || priority) {
        entry.priority = frontmatter.priority || priority;
      }
      if (frontmatter.lastmod || lastmod) {
        entry.lastmod = frontmatter.lastmod || lastmod;
      }

      // Add the entry to the sitemap
      sitemap.add(entry);
    });

    // Create sitemap in files
    files[output] = {
      contents: new Buffer(sitemap.toString())
    };

    done();
  };
}