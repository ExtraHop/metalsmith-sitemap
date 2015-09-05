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
      "changefreq": "weekly",
      "hostname": "http://www.website.com/",
      "output": "sitemap.xml",
      "pattern": "**/*.html",
      "priority": "0.5"
    }
  }
}
```

## Options

You can pass options to `metalsmith-sitemap` with the [Javascript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli). The options are:

##### hostname

* `required`

The hostname used for generating the urls. The url must have a trailing slash.

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

## Frontmatter

Some values can also be set on a file-to-file basis from a file's frontmatter, the options are:

* `canonical`: will override the filename used to generate the url. As an example: you can use this to generate `http://www.website.com/` instead of `http://www.website.com/index.html` for your root page, by setting `canonical: ''`.
* `changefreq`: will override any other settings for `changefreq` for the current file.
* `lastmod`: will override any other settings for `lastmod` for the current file.
* `priority`: will override any other settings for `priority` for the current file.

For example:

```html
---
canonical: ''
changefreq: always
lastmod: 2014-12-01
priority: 1.0
---
<!-- index.html -->
```

## License

MIT
