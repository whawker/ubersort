var grunt = require('grunt');
module.exports = {
    server: {
        options: {
            port: 9001,
            hostname: '*',
            keepalive: true
        }
    },
    cli: {
        options: {
            port: 9502
        }
    },
    coverage: {
        options: {
            port: 9503,
            middleware: function (connect, options) {
                var static = connect.static(String(options.base));
                return [function (request, response, next) {
                    var instrumented = '.grunt/grunt-contrib-jasmine' + request.url;
                    if (grunt.file.exists(instrumented)) {
                        // redirect to instrumented source
                        request.url = '/' + instrumented;
                    }
                    return static.apply(this, arguments);
                }];
            }
        }
    }
}
