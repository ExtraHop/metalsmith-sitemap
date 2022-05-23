const get = require('lodash.get')
const pick = require('lodash.pickby')
const identity = require('lodash.identity')
const path = require('path')
const { streamToPromise, SitemapStream } = require('sitemap')

function replaceBackslash(url) {
  return url.replace(/\\/g, '/')
}

/**
 * Metalsmith plugin for generating a sitemap.
 * See
 *
 * @param {Object} options
 * @param {String} options.hostname The hostname used for generating the urls.
 * @param {Date} [options.lastmod] Add a lastmodified date to the sitemap. Should be a Date object and can be passed through the Javascript API or the frontmatter.
 * @param {String} [options.links] Allows you to define [alternate language pages](https://github.com/ekalinin/sitemap.js/blob/6.4.0/api.md#sitemap-item-options).
 * @param {String} [options.changefreq] Change the default [changefreq](http://www.sitemaps.org/protocol.html).
 * @param {Boolean} [options.omitExtension] Will remove extensions from the urls in the sitemap. Useful when you're rewriting urls.
 * @param {Boolean} [options.omitIndex] Will replace any paths ending in `index.html` with `''`. Useful when you're using [@metalsmith/permalinks](https://github.com/metalsmith/permalinks).
 * @param {String} [options.output] Change the output file for the sitemap. Default:`sitemap.xml`
 * @param {String} [options.pattern] Only files that match this pattern will be included in the sitemap. Can be a string or an array of strings.
 * @param {String} [options.priority] Change the default [priority](http://www.sitemaps.org/protocol.html).
 * @param {String} [options.urlProperty] Choose which property to use as the canonical url in the frontmatter.
 * @param {String} [options.modifiedProperty] Choose which property to use as the last modified string. Default: `lastmod`
 * @param {String} [options.privateProperty] Choose which property to use for ignoring a file in the frontmatter. Default: `private`
 * @param {String} [options.priorityProperty] Choose which property to use as the canonical url in the frontmatter. Default: `priority`
 * @return {import('metalsmith').Plugin}
 */
function initSitemap(options) {
  /**
   * Init
   */
  options = options || {}

  // Accept string option to specify the hostname
  if (typeof options === 'string') {
    options = { hostname: options }
  }

  // A hostname should be specified
  if (!options.hostname) {
    throw new Error('"hostname" option required')
  }

  // Map options to local variables and set defaults
  const {
    hostname,
    changefreq,
    lastmod,
    links,
    omitExtension,
    omitIndex,
    priority,
    pattern,
    priorityProperty,
    urlProperty,
    privateProperty,
    modifiedProperty,
    output
  } = {
    output: 'sitemap.xml',
    pattern: '**/*.html',
    urlProperty: 'canonical',
    modifiedProperty: 'lastmod',
    privateProperty: 'private',
    priorityProperty: 'priority',
    ...options
  }

  return function sitemap(files, metalsmith, done) {
    // Create sitemap object
    const sitemap = new SitemapStream({
      hostname
    })

    // Builds a url
    function buildUrl(file, filemetadata) {
      // filemetadata settings take precedence
      const canonicalUrl = get(filemetadata, urlProperty, null)
      if (typeof canonicalUrl === 'string') {
        return canonicalUrl
      }

      // Remove index.html if necessary
      const indexFile = 'index.html'
      if (omitIndex && path.basename(file) === indexFile) {
        return replaceBackslash(file.slice(0, 0 - indexFile.length))
      }

      // Remove extension if necessary
      if (omitExtension) {
        return replaceBackslash(file.slice(0, 0 - path.extname(file).length))
      }

      // Otherwise just use 'file'
      return replaceBackslash(file)
    }

    metalsmith.match(pattern, Object.keys(files)).forEach(function (file) {
      // Get the current file's filemetadata
      const filemetadata = files[file]

      // Don't process private files
      if (get(filemetadata, privateProperty)) {
        return
      }

      // Create the sitemap entry (reject keys with falsy values)
      const entry = pick(
        {
          changefreq: filemetadata.changefreq || changefreq,
          priority: get(filemetadata, priorityProperty, priority),
          lastmod: get(filemetadata, modifiedProperty, lastmod),
          links: get(filemetadata, links)
        },
        identity
      )

      // Add the url (which is allowed to be falsy)
      entry.url = buildUrl(file, filemetadata)

      // Add the entry to the sitemap
      sitemap.write(entry)
    })

    sitemap.end()

    streamToPromise(sitemap).then((buffer) => {
      // Create sitemap in files
      files[output] = {
        contents: buffer.toString()
      }
      done()
    }, done)
  }
}

/**
 * Export plugin
 */
module.exports = initSitemap
