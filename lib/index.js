var fs = require('fs'),
    _ = require('lodash'),
    moment = require('moment'),
    toFn = require('to-function'),
    url = require('url'),
    defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
        return _.merge(value, other, deep);
    });

module.exports = plugin;

function plugin(options) {
    options = options || {};

    var templatesDir = __dirname + '/templates';

    defaultsDeep(options, {
        ignoreFiles: [],
        output: 'sitemap.xml',
        modifiedProperty: 'modified',
        urlProperty: 'path',
        hostname: '',
        entryTemplate: templatesDir + '/entry.xml',
        sitemapTemplate: templatesDir + '/sitemap.xml',
        defaults: {
            priority: 0.5,
            changefreq: 'daily'
        }
    });
    
    var getUrl = toFn(options.urlProperty),
        getModified = toFn(options.modifiedProperty);

    var entryTemplate = fs.readFileSync(options.entryTemplate, {encoding: 'utf8'});
    var sitemapTemplate = fs.readFileSync(options.sitemapTemplate, {encoding: 'utf8'});

    entryTemplate = _.template(entryTemplate);
    sitemapTemplate = _.template(sitemapTemplate);

    return function(files, metalsmith, done) {
        var entries,
            entry,
            file,
            data;

        entries = _(Object.keys(files)).map(function (file) {
            data = files[file];

            if (!shouldIgnore(file) || data.private) {
                return;
            }

            data.sitemap = data.sitemap || {};

            try {
                var theUrl = getUrl(data),
                    lastModified = getModified(data);
            } catch(e) {
                console.error('Failed to fetch information for file:', file);
                return done(e);
            }

            if (!theUrl) {
                return;
            }

            if (!lastModified) {
                if (data && data.stats && data.stats.mtime) {
                     lastModified = moment(data.stats.mtime).format("YYYY-MM-DD");
                }
                else {
                    return;
                }
            }

            entry = _.defaults({
                loc: url.resolve(options.hostname, theUrl),
                lastmod: lastModified,
                changefreq: data.sitemap.changefreq,
                priority: data.sitemap.priority
            }, options.defaults);

            return entryTemplate(entry);
        }).compact().join('');

        var contents = sitemapTemplate({entries: entries});
        files[options.output] = {
            contents: new Buffer(contents)
        };

        done();
    };

    function shouldIgnore(file) {
        return !_.some(options.ignoreFiles, function(ignore) {
            return ignore.test(file);
        });
    }
}

function error(file, message) {
    return message + '\nFile: ' + file +
            '\nTo skip validation on this file add it to the ' +
            'ignoreFiles array.\n\n';
}
