var grunt = require('grunt');

module.exports = {
    quality: {
        files: {
            'quality': ['dist/ubersort.js']
        },
        options: {
            jshint: grunt.file.readJSON('.jshintrc')
        }
    }
}
