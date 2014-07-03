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

###Front Matter
There are a few properties that Sitemap will use from a files front matter. The first two, mentioned above, are
configurable. The next two are expected to be at a set location. These are page specific values for `priority` and
`changefreq` which should be at `sitemap.priority` and `sitemap.changefreq` respectively.

The last piece of front matter that the sitemap pays attention to is another way of ignoring files. If a file has
`private` set to true in the front matter it will be skipped in the sitemap`private` set to true in the front matter it
will be skipped inthe sitemap.
