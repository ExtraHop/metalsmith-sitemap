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

  it('should allow changefreq and priority to be overridden from the frontmatter', function(done){
    Metalsmith('test/fixtures/frontmatter')
      .use(sitemap({
        hostname: 'http://www.website.com/',
        changefreq: 'never',
        priority: '0.0'
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

});
