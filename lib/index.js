/**
 * Dependencies
 */
const identity = require('lodash.identity');
const get = require('lodash.get');
const is = require('is');
const match = require('multimatch');
const path = require('path');
const groupBy = require('lodash.groupby');
const pick = require('lodash.pick');
const sm = require('sitemap');

/**
 * Metalsmith plugin for generating a sitemap.
 *
 * @param {String or Object} options
 *   @property {String} groupby (optional)
 *   @property {Date} lastmod (optional)
 *   @property {String} links (optional)
 *   @property {String} changefreq (optional)
 *   @property {Boolean} omitExtension (optional)
 *   @property {Boolean} omitIndex (optional)
 *   @property {String} hostname
 *   @property {String} output (optional)
 *   @property {String} pattern (optional)
 *   @property {String} priority (optional)
 *   @property {String} urlProperty (optional)
 *   @property {String} modifiedProperty (optional)
 *   @property {String} privateProperty (optional)
 *   @property {String} priorityProperty (optional)
 * @return {Function}
 */
const plugin = opts => (files, metalsmith, done) => {
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
    return done(new Error('"hostname" option required'));
  }

  // Map options to local variables and set defaults
  const {
    changefreq,
    groupby,
    hostname,
    lastmod,
    links,
    omitExtension,
    omitIndex,
    output = 'sitemap.xml',
    pattern = '**/*.html',
    priority,
    urlProperty = 'canonical',
    modifiedProperty = 'lastmod',
    privateProperty = 'private',
    priorityProperty = 'priority'
  } = opts;
  // Create sitemap object
  let sitemap = sm.createSitemap({
    hostname: hostname
  });

  const processFile = filename => {
    // Get the current file's frontmatter
    const file = files[filename];

    // Only process files that pass the check
    if (!check(filename, file)) {
      return;
    }

    // Create the sitemap entry (reject keys with falsy values)
    const entry = pick(
      {
        changefreq: file.changefreq || changefreq,
        priority: get(file, priorityProperty) || priority,
        lastmod: get(file, modifiedProperty) || lastmod,
        links: get(file, links)
      },
      identity
    );

    // Add the url (which is allowed to be falsy)
    entry.url = buildUrl(filename, file);

    // Add the entry to the sitemap
    sitemap.add(entry);
  };

  // Checks whether files should be processed
  function check(file, frontmatter) {
    // Only process files that match the pattern
    if (!match(file, pattern)[0]) {
      return false;
    }

    // Don't process private files
    if (get(frontmatter, privateProperty)) {
      return false;
    }

    return true;
  }

  // Builds a url
  function buildUrl(file, frontmatter) {
    // Frontmatter settings take precedence
    const canonicalUrl = get(frontmatter, urlProperty);
    if (is.string(canonicalUrl)) {
      return canonicalUrl;
    }

    // Remove index.html if necessary
    const indexFile = 'index.html';
    if (omitIndex && path.basename(file) === indexFile) {
      return replaceBackslash(file.slice(0, 0 - indexFile.length));
    }

    // Remove extension if necessary
    if (omitExtension) {
      return replaceBackslash(file.slice(0, 0 - path.extname(file).length));
    }

    // Otherwise just use 'file'
    return replaceBackslash(file);
  }

  function replaceBackslash(url) {
    return url.replace(/\\/g, '/');
  }

  if (groupby) {
    const output_filenames = [];
    const groups = groupBy(Object.keys(files), filename => {
      const file = files[filename];
      return get(file, groupby);
    });

    Object.entries(groups).forEach(([key, filenames]) => {
      const output_filename = `sitemap-${key}.xml`;
      output_filenames.push(output_filename);

      sitemap = sm.createSitemap({
        hostname: hostname
      });
      filenames.forEach(processFile);
      files[output_filename] = {
        contents: Buffer.from(sitemap.toString(), 'utf8')
      };
    });

    files[output] = {
      contents: Buffer.from(sitemap.toString(), 'utf8')
    };

    // Build sitemap index
    files[output] = {
      contents: Buffer.from(
        sm.buildSitemapIndex({
          urls: output_filenames.map(filename => `${hostname}${filename}`)
        }),
        'utf8'
      )
    };
  } else {
    Object.keys(files).forEach(processFile);

    // Create sitemap in files
    files[output] = {
      contents: Buffer.from(sitemap.toString(), 'utf8')
    };
  }

  return done();
};

/**
 * Export plugin
 */
module.exports = plugin;
