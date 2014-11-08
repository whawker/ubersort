module.exports = {
    test: {
        options: {
            specs: 'test/*Spec.js',
            host: 'http://localhost:9502',
            template: require('grunt-template-jasmine-requirejs'),
            outfile: '_jasmine.html',
            templateOptions: {
                requireConfigFile: 'test/main.js'
            }
        }
    },
    coverage: {
        src: ['dist/ubersort.js'],
        options: {
            specs: 'test/*Spec.js',
            host: 'http://localhost:9503/',
            template: require('grunt-template-jasmine-istanbul'),
            templateOptions: {
                coverage: 'coverage/coverage.json',
                report: [
                    {
                        type: 'text-summary'
                    },
                    {
                        type: 'html',
                        options: {
                            dir: 'coverage/html'
                        }
                    },
                    {
                        type: 'cobertura',
                        options: {
                            dir: 'coverage/cobertura'
                        }
                    }
                ],
                replace: false,
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfigFile: 'test/main.js'
                }
            }
        }
    }
};
