var Handlebars = require('handlebars'),
    _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    moment = require('moment'),
    readFile = Q.denodeify(fs.readFile),
    writeFile = Q.denodeify(fs.writeFile);

function HTMLReport (grunt) {
    var finished = this.async(),
        jsonReportPath = grunt.config.get('behathtmlreport').features.src,
        htmlReportPath = grunt.config.get('behathtmlreport').features.output;

    function init () {
        readFile(jsonReportPath, 'utf-8')
            .then(parseSource, grunt.fail.fatal)
            .then(outputReport, grunt.fail.fatal);
    }

    function parseSource (contents) {
        var source = JSON.parse(contents),
            dateFormat = 'MMMM Do YYYY, h:mm:ss a';
        source.startTime = moment(source.start).format(dateFormat);
        source.lastUpdated = moment(source.start + source.duration).format(dateFormat);
        source.killedTasks = _.chain(source.tasks).filter(function (t) {
            return _.where(t.results, {status: 'forceKillTimeout'}).length;
        }).value();

            _.each(source.tasks, function  (t) {
                t.filename = t.filename.replace(/.*features\/Scenarios\//, '');
            });

        return source;
    }

    function outputReport (source) {
        Q.spread([
            source,
            readFile(__dirname + '/feature-report-header.hbs', 'utf-8'),
            readFile(__dirname + '/feature-report-task.hbs', 'utf-8')
        ], generateHTML, grunt.fail.fatal)
        .then(writeHTML, grunt.fail.fatal)
        .fin(finished);
    }

    function generateHTML (source, headerTemplate, taskTemplate) {
        var header = Handlebars.compile(headerTemplate),
            task = Handlebars.compile(taskTemplate);

            Handlebars.registerHelper('eq', function (a, b, options) {
                return a === b ? options.fn(this) : options.inverse(this);
            });
            Handlebars.registerHelper('getResultStatus', getStatus);
            Handlebars.registerHelper('getResultCss', _.partial(getCss, source.start));
            Handlebars.registerHelper('getResultSummary', getSummary);
            source.content = _.map(source.tasks, task).join('\n');

        return header(source);
    }

    function writeHTML (html) {
        return writeFile(htmlReportPath, html);
    }

    function getStatus () {
        var status = this.status || 'pending';
        return status === 'succeeded' && !this.scenarios ? 'skipped' : status;
    }

    function getCss (offset) {
        var left = function (start) { return Math.floor((start - offset) / 1000); },
            width = function (duration) { return Math.floor(duration / 1000); },
            duration = this.duration || (+new Date() - this.start);

        return 'position: absolute; top: 0px; left: ' + left(this.start) + '; width: ' + width(duration) + ';';
    }

    function getSummary () {
        var template = Handlebars.compile('{{getResultStatus}} in {{duration}}:\n{{result}}'),
            pendingTemplate = Handlebars.compile('started {{duration}} ago'),

            duration = this.duration ? this.duration : +new Date() - this.start,
            totalSeconds = Math.floor(duration / 1000),
            minutes = Math.floor(totalSeconds / 60),
            seconds = totalSeconds % 60,

            result = _.map(this.scenarios, function (v, k) { return k + ': ' + v; }).join(', '),

            args = {
                status: this.status,
                duration: minutes + ' minutes, ' + seconds + ' seconds',
                result: result,
                scenarios: this.scenarios
            };

        return this.duration ? template(args) : pendingTemplate(args);
    }

    init();
}

module.exports = HTMLReport;