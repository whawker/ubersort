
var Handlebars = require('handlebars'),
    _ = require('underscore'),
    Q = require('q'),
    fs = require('fs'),
    moment = require('moment'),
    readFile = Q.denodeify(fs.readFile),
    writeFile = Q.denodeify(fs.writeFile);

function HTMLReport (grunt) {
    var finished = this.async(),
        jsonReportPath = grunt.config.get('behathtmlreport').scenarios.src,
        htmlReportPath = grunt.config.get('behathtmlreport').scenarios.output;

    function init () {
        readFile(jsonReportPath, 'utf-8')
            .then(parseSource, grunt.fail.fatal)
            .then(getFailures, grunt.fail.fatal)
            .then(outputReport, grunt.fail.fatal);
    }

    function parseSource (contents) {
        var source = JSON.parse(contents),
            timeregex = /\d+/,
            dateFormat = 'MMMM Do YYYY, h:mm:ss a';
        source.startTime = moment(timeregex.exec(source.startTime) * 1000).format(dateFormat);
        source.lastUpdated = moment(timeregex.exec(source.lastUpdated) * 1000).format(dateFormat);
        return source;
    }

    function getFailures (source) {
        source.scenarios = _.filter(source.scenarios, function (scenario) {
            return scenario.status !== 'passed';
        });
        return source;
    }

    function outputReport (source) {
        Q.spread([
            source,
            readFile(__dirname + '/html-report-header.hbs', 'utf-8'),
            readFile(__dirname + '/html-report-scenario.hbs', 'utf-8')
        ], generateHTML, grunt.fail.fatal)
        .then(writeHTML, grunt.fail.fatal)
        .fin(finished);
    }

    function generateHTML (source, headerTemplate, scenarioTemplate) {
        var header = Handlebars.compile(headerTemplate),
            scenario = Handlebars.compile(scenarioTemplate);
            scenarioHTML = _.map(source.scenarios, scenario).join('\n');

        return header({content: scenarioHTML, startTime: source.startTime, lastUpdated: source.lastUpdated});
    }

    function writeHTML (html) {
        return writeFile(htmlReportPath, html);
    }

    init();
}

module.exports = HTMLReport;