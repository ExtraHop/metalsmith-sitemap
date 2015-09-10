var assert = require('assert');
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var sitemap = require('..');

describe('metalsmith-sitemap', function(){
  it('should only process html by default', function(done){
    Metalsmith('test/fixtures/html')
      .use(sitemap('http://www.website.com/'))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/html/expected', 'test/fixtures/html/build');
        done();
      });
  });

  it('should accept a string as the hostname', function(done){
    Metalsmith('test/fixtures/hostname')
      .use(sitemap('http://www.website.com/'))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/hostname/expected', 'test/fixtures/hostname/build');
        done();
      });
  });

  it('should accept defaults for changefreq and priority', function(done){
    Metalsmith('test/fixtures/defaults')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        changefreq: 'never',
        priority: '0.0'
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/defaults/expected', 'test/fixtures/defaults/build');
        done();
      });
  });

  it('should allow settings to be overridden from the frontmatter', function(done){
    Metalsmith('test/fixtures/frontmatter')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        changefreq: 'never',
        priority: '0.0',
        lastmod: new Date()
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/frontmatter/expected', 'test/fixtures/frontmatter/build');
        done();
      });
  });

  it('should allow the sitemap\'s location to be changed', function(done){
    Metalsmith('test/fixtures/output')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        output: 'mapsite.xml'
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/output/expected', 'test/fixtures/output/build');
        done();
      });
  });

  it('should accept a pattern', function(done){
    Metalsmith('test/fixtures/pattern')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        pattern: ['**/*.html', '**/*.hbs']
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/pattern/expected', 'test/fixtures/pattern/build');
        done();
      });
  });

  it('should allow a canonical url to be set', function(done){
    Metalsmith('test/fixtures/canonical')
      .use(sitemap('http://www.website.com/'))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/canonical/expected', 'test/fixtures/canonical/build');
        done();
      });
  });

  it('should allow lastmod to be set', function(done){
    Metalsmith('test/fixtures/lastmod')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        lastmod: new Date('1995-12-17T12:24:00')
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/lastmod/expected', 'test/fixtures/lastmod/build');
        done();
      });
  });

  it('should allow a canonical url and lastmod to be set from custom property', function(done){
    Metalsmith('test/fixtures/custom-frontmatter')
      .use(sitemap({
        hostname: 'http://www.website.com',
        modifiedProperty: 'lastModified',
        urlProperty: 'seo.canonical'
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/custom-frontmatter/expected', 'test/fixtures/custom-frontmatter/build');
        done();
      });
  });

  it('should be able to omit extensions', function(done){
    Metalsmith('test/fixtures/omitExtension')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        omitExtension: true
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/omitExtension/expected', 'test/fixtures/omitExtension/build');
        done();
      });
  });

  it('should be able to omit index.html', function(done){
    Metalsmith('test/fixtures/omitIndex')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        omitIndex: true
      }))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/omitIndex/expected', 'test/fixtures/omitIndex/build');
        done();
      });
  });

  it('should ignore files marked as private', function(done){
    Metalsmith('test/fixtures/private')
      .use(sitemap('http://www.website.com/'))
      .build(function(err){
        if (err) {
          return done(err);
        }
        equal('test/fixtures/private/expected', 'test/fixtures/private/build');
        done();
      });
  });

});
