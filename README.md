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
      "hostname": "http://www.website.com/",
      "priority": "0.5",
      "changefreq": "weekly",
      "pattern": "**/*.html",
      "output": "sitemap.xml"
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

## Frontmatter

The `changefreq` and `priority` settings can also be overridden on a file-to-file basis from a file's frontmatter like so:

```html
---
changefreq: always
priority: 1.0
---
<!-- index.html -->
These changefreq and priority settings will override any other settings for changefreq and priority, for this file only.
```

## License

MIT
