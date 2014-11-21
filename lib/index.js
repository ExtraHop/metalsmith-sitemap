var fs = require('fs'),
    Handlebars = require('handlebars'),
    _ = require('lodash'),
    url = require('url'),
    defaultsDeep = _.partialRight(_.merge, function deep(value, other) {
        return _.merge(value, other, deep);
    }),
    resolve = function(object, property) {
        return _.reduce(property.split('.'), function(o, p) {
            return o ? o[p] : undefined;
        }, object);
    };

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

    var entryTemplate = fs.readFileSync(options.entryTemplate, {encoding: 'utf8'});
    var sitemapTemplate = fs.readFileSync(options.sitemapTemplate, {encoding: 'utf8'});

    entryTemplate = Handlebars.compile(entryTemplate);
    sitemapTemplate = Handlebars.compile(sitemapTemplate);

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

            entry = _.defaults({
                loc: url.resolve(options.hostname, resolve(data, options.urlProperty)),
                lastmod: resolve(data, options.modifiedProperty),
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
