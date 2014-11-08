module.exports = {
    compile: {
        options: {
            mainConfigFile: 'test/main.js',
            baseUrl: './',
            name: 'bower_components/almond/almond',
            deps: ['test/main'],
            insertRequire: ['test/main'],
            out: 'test/compiled.js',
            preserveLicenseComments: false,
            optimize: 'uglify2',
            generateSourceMaps: true
        }
    }
};
