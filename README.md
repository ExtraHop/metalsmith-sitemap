metalsmith-sitemap
==========================
This provides a [metalsmith](http://www.metalsmith.io/) plugin to generate a sitemap according to the
[Sitemaps Protocol](http://www.sitemaps.org/protocol.html). There are four pieces of information possible for on any page.
The URL of the page (loc), the last modified date (lastmod), the change frequency (changefreq) and the priority. loc is
the only value that is required.

###Options
```
var Sitemap = require('metalsmith-sitemap');

Sitemap({
    ignoreFiles: [/test.xml/], // Matched files will be ignored
    output: 'sitemap.xml', // The location where the final sitemap should be placed
    urlProperty: 'seo.canonical', // Key for URL property
    modifiedProperty: 'modified', // Key for last modified property
    defaults: { // You can provide default values for any property in here
        priority: 0.5,
        changefreq: 'daily'
    }
})
```
Note that the property keys (`urlProperty`, `modifiedProperty`) can use the dot syntax to traverse the front matter
object for any given page.
