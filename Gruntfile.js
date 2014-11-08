module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        bower: require('./grunt/bower.js'),
        jshint: require('./grunt/jshint.js'),
        jasmine: require('./grunt/jasmine.js'),
        connect: require('./grunt/connect.js'),
        uglify: require('./grunt/uglify.js'),
        plato: require('./grunt/plato.js')
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-plato');

    grunt.registerTask('coverage', 'Launches a connect server for coverage reports', function () {
        grunt.task.run(['connect:coverage', 'jasmine:coverage', 'connect:server']);
        grunt.log.writeln('Coverage report can be found at: http://localhost:9001/coverage/html/');
    });
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', 'Run Jasmine tests on the commandline', ['connect:cli', 'jasmine:test']);
    grunt.registerTask('test:server', 'Launches a connect server for Jasmine tests', function () {
        grunt.task.run(['jasmine:test:build', 'connect:server']);
        grunt.log.writeln('Tests can be found at: http://localhost:9001/_jasmine.html');
    });
    grunt.registerTask('quality', 'Launches a connect server for Jasmine tests', function () {
        grunt.task.run(['plato:quality', 'connect:server']);
        grunt.log.writeln('Results can be found at: http://localhost:9001/quality.html');
    });
    grunt.registerTask('default', ['jshint', 'bower', 'test']);
};
