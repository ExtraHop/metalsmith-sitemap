# metalsmith-sitemap

> A metalsmith plugin for generating a sitemap

This plugin allows you to generate a [sitemap.xml](http://www.sitemaps.org/protocol.html) from your source files. By default it looks for any `.html` files and processes them with [sitemap.js](https://github.com/ekalinin/sitemap.js).

## Installation

```bash
$ npm install metalsmith-sitemap
```

## Example

Configuration in `metalsmith.json`:

```json
{
  "plugins": {
    "metalsmith-sitemap": {
      "hostname": "http://www.website.com"
    }
  }
}
```

## Options

You can pass options to `metalsmith-sitemap` with the [Javascript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli). The options are:

##### hostname

* `required`

The hostname used for generating the urls.

##### changefreq

* `optional`
* `default: weekly`

Change the default [changefreq](http://www.sitemaps.org/protocol.html).

##### pattern

* `optional`
* `default: '**/*.html'`

A [multimatch](https://github.com/sindresorhus/multimatch) pattern. Only files that match this pattern will be included in the sitemap. Can be a string or an array of strings.

##### priority

* `optional`
* `default: '0.5'`

Change the default [priority](http://www.sitemaps.org/protocol.html).

##### output

* `optional`
* `default: 'sitemap.xml'`

Change the output file for the sitemap.

##### lastmod

* `optional`

Add a lastmodified date to the sitemap. Should be a Date object and can be passed through the Javascript API or the frontmatter.

##### omitExtension

* `optional`
* `default: false`

Will remove extensions from the urls in the sitemap. Useful when you're rewriting urls.

##### omitIndex

* `optional`
* `default: false`

Will replace any paths ending in `index.html` with `''`. Useful when you're using [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks).

##### modifiedProperty

* `optional`
* `default: lastmod`

Allows you to choose which property to use as the last modified string. This accepts nested properties in dot notation via [loadsh.get](https://lodash.com/docs#get).

##### urlProperty

* `optional`
* `default: canonical`

Allows you to choose which property to use as the canonical url in the frontmatter. This accepts nested properties in dot notation via [loadsh.get](https://lodash.com/docs#get).

## Frontmatter

Some values can also be set on a file-to-file basis from a file's frontmatter, the options are:

* `canonical`: will override the filename used to generate the url. The path is relative to the hostname.
* `changefreq`: will override any other settings for `changefreq` for the current file.
* `lastmod`: will override any other settings for `lastmod` for the current file.
* `priority`: will override any other settings for `priority` for the current file.
* `private`: will exclude the file from the sitemap when set to true.

For example:

```html
---
canonical: 'different'
changefreq: always
lastmod: 2014-12-01
priority: 1.0
private: true
---
<!-- index.html -->
```

## License

MIT
