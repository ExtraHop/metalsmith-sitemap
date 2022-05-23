/**
 * Dependencies
 */
const identity = require('lodash.identity')
const get = require('lodash.get')
const is = require('is')
const match = require('multimatch')
const path = require('path')
const pick = require('lodash.pick')
const sm = require('sitemap')

function replaceBackslash(url) {
  return url.replace(/\\/g, '/')
}
/**
 * Metalsmith plugin for generating a sitemap.
 *
 * @param {String or Object} options
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
function plugin(opts) {
  /**
   * Init
   */
  opts = opts || {}

  // Accept string option to specify the hostname
  if (typeof opts === 'string') {
    opts = { hostname: opts }
  }

  // A hostname should be specified
  if (!opts.hostname) {
    throw new Error('"hostname" option required')
  }

  // Map options to local variables and set defaults
  const changefreq = opts.changefreq
  const hostname = opts.hostname
  const lastmod = opts.lastmod
  const links = opts.links
  const omitExtension = opts.omitExtension
  const omitIndex = opts.omitIndex
  const output = opts.output || 'sitemap.xml'
  const pattern = opts.pattern || '**/*.html'
  const priority = opts.priority
  const urlProperty = opts.urlProperty || 'canonical'
  const modifiedProperty = opts.modifiedProperty || 'lastmod'
  const privateProperty = opts.privateProperty || 'private'
  const priorityProperty = opts.priorityProperty || 'priority'

  /**
   * Main plugin function
   */
  return function sitemap(files, metalsmith, done) {
    // Create sitemap object
    const sitemap = sm.createSitemap({
      hostname: hostname
    })

    // Checks whether files should be processed
    function check(file, frontmatter) {
      // Only process files that match the pattern
      if (!match(file, pattern)[0]) {
        return false
      }

      // Don't process private files
      if (get(frontmatter, privateProperty)) {
        return false
      }

      return true
    }

    // Builds a url
    function buildUrl(file, frontmatter) {
      // Frontmatter settings take precedence
      const canonicalUrl = get(frontmatter, urlProperty)
      if (is.string(canonicalUrl)) {
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

    Object.keys(files).forEach(function (file) {
      // Get the current file's frontmatter
      const frontmatter = files[file]

      // Only process files that pass the check
      if (!check(file, frontmatter)) {
        return
      }

      // Create the sitemap entry (reject keys with falsy values)
      const entry = pick(
        {
          changefreq: frontmatter.changefreq || changefreq,
          priority: get(frontmatter, priorityProperty) || priority,
          lastmod: get(frontmatter, modifiedProperty) || lastmod,
          links: get(frontmatter, links)
        },
        identity
      )

      // Add the url (which is allowed to be falsy)
      entry.url = buildUrl(file, frontmatter)

      // Add the entry to the sitemap
      sitemap.add(entry)
    })

    // Create sitemap in files
    files[output] = {
      contents: Buffer.from(sitemap.toString())
    }

    done()
  }
}

/**
 * Export plugin
 */
module.exports = plugin
