/**
 * Dependencies
 */
var identity = require('lodash.identity');
var get = require('lodash.get');
var is = require('is');
var match = require('multimatch');
var path = require('path');
var pick = require('lodash.pick');
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
 *   @property {String} urlProperty (optional)
 *   @property {String} modifiedProperty (optional)
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
  var urlProperty = opts.urlProperty || 'canonical';
  var modifiedProperty = opts.modifiedProperty || 'lastmod';

  /**
   * Main plugin function
   */
  return function(files, metalsmith, done) {
    // Create sitemap object
    var sitemap = sm.createSitemap ({
      hostname: hostname
    });

    // Checks whether files should be processed
    function check(file, frontmatter) {
      // Only process files that match the pattern
      if (!match(file, pattern)[0]) {
        return false;
      }

      // Don't process private files
      if (frontmatter.private) {
        return false;
      }

      return true;
    }

    // Builds a url
    function buildUrl(file, frontmatter) {
      // Frontmatter settings take precedence
      var canonicalUrl = get(frontmatter, urlProperty);
      if (is.string(canonicalUrl)) {
        return canonicalUrl;
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

    Object.keys(files).forEach(function(file) {
      // Get the current file's frontmatter
      var frontmatter = files[file];

      // Only process files that pass the check
      if (!check(file, frontmatter)) {
        return;
      }

      // Create the sitemap entry (reject keys with falsy values)
      var entry = pick({
        changefreq: frontmatter.changefreq || changefreq,
        priority: frontmatter.priority || priority,
        lastmod: get(frontmatter, modifiedProperty) || lastmod
      }, identity);

      // Add the url (which is allowed to be falsy)
      entry.url = buildUrl(file, frontmatter);

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
