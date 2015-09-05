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

Some values can also be set on a file-to-file basis from a file's frontmatter, the options are:

* `changefreq`: will override any other settings for `changefreq` for the current file.
* `priority`: will override any other settings for `priority` for the current file.
* `canonical`: will override the filename which is normally used to generate the url. As an example: you can use this to generate `http://www.website.com/` instead of `http://www.website.com/index.html` for you root page, by setting `canonical: ''`.

For example:

```html
---
changefreq: always
priority: 1.0
canonical: ''
---
<!-- index.html -->
```

## License

MIT
