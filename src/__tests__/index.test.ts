import equal from "assert-dir-equal";
import Metalsmith from "metalsmith";
import sitemap from "../index";

describe("metalsmith-sitemap", () => {
  test("should only process html by default", done => {
    Metalsmith("test/fixtures/html")
      .use(sitemap("http://www.website.com/"))
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal("test/fixtures/html/expected", "test/fixtures/html/build")
        ).not.toThrow();
        done();
      });
  });

  test("should accept a string as the hostname", done => {
    Metalsmith("test/fixtures/hostname")
      .use(sitemap("http://www.website.com/"))
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/hostname/expected",
            "test/fixtures/hostname/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should accept defaults for changefreq and priority", done => {
    Metalsmith("test/fixtures/defaults")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          changefreq: "never",
          priority: 0.1
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/defaults/expected",
            "test/fixtures/defaults/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should allow settings to be overridden from the frontmatter", done => {
    Metalsmith("test/fixtures/frontmatter")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          changefreq: "never",
          priority: 0.1,
          lastmod: new Date()
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/frontmatter/expected",
            "test/fixtures/frontmatter/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should allow the sitemap's location to be changed", done => {
    Metalsmith("test/fixtures/output")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          output: "mapsite.xml"
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal("test/fixtures/output/expected", "test/fixtures/output/build")
        ).not.toThrow();
        done();
      });
  });

  test("should accept a pattern", done => {
    Metalsmith("test/fixtures/pattern")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          pattern: ["**/*.html", "**/*.hbs"]
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal("test/fixtures/pattern/expected", "test/fixtures/pattern/build")
        ).not.toThrow();
        done();
      });
  });

  test("should allow a canonical url to be set", done => {
    Metalsmith("test/fixtures/canonical")
      .use(sitemap("http://www.website.com/"))
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/canonical/expected",
            "test/fixtures/canonical/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should allow lastmod to be set", done => {
    Metalsmith("test/fixtures/lastmod")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          lastmod: new Date("1995-12-17T12:24:00")
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal("test/fixtures/lastmod/expected", "test/fixtures/lastmod/build")
        ).not.toThrow();
        done();
      });
  });

  test("should allow a canonical url, lastmod and priority to be set from custom property", done => {
    Metalsmith("test/fixtures/custom-frontmatter")
      .use(
        sitemap({
          hostname: "http://www.website.com",
          modifiedProperty: "lastModified",
          urlProperty: "seo.canonical",
          priorityProperty: "order"
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/custom-frontmatter/expected",
            "test/fixtures/custom-frontmatter/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should be able to omit extensions", done => {
    Metalsmith("test/fixtures/omitExtension")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          omitExtension: true
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/omitExtension/expected",
            "test/fixtures/omitExtension/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should be able to omit index.html", done => {
    Metalsmith("test/fixtures/omitIndex")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          omitIndex: true
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/omitIndex/expected",
            "test/fixtures/omitIndex/build"
          )
        ).not.toThrow();
        done();
      });
  });

  test("should ignore files marked as private", done => {
    Metalsmith("test/fixtures/private")
      .use(sitemap("http://www.website.com/"))
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal("test/fixtures/private/expected", "test/fixtures/private/build")
        ).not.toThrow();
        done();
      });
  });

  test("should handle files with links", done => {
    Metalsmith("test/fixtures/links")
      .use(
        sitemap({
          hostname: "http://www.website.com/",
          links: "links"
        })
      )
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal("test/fixtures/links/expected", "test/fixtures/links/build")
        ).not.toThrow();
        done();
      });
  });

  test("should replace win32 backslash by slash", done => {
    Metalsmith("test/fixtures/win32-backslash")
      .use(sitemap("http://www.website.com/"))
      .build(function(err) {
        if (err) {
          return done(err);
        }
        expect(() =>
          equal(
            "test/fixtures/win32-backslash/expected",
            "test/fixtures/win32-backslash/build"
          )
        ).not.toThrow();
        done();
      });
  });
});
