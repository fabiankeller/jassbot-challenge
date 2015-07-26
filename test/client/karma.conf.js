'use strict';

module.exports = function(config) {
    config.set({
        basePath: '../../',

        frameworks: ['browserify', 'mocha'],

        reporters: ['mocha'],

        preprocessors: {
            'build/test/client/**/*.js': ['browserify']
        },

        browsers: ['PhantomJS'],

        plugins: [
            'karma-mocha',
            'karma-phantomjs-launcher',
            'karma-bro',
            'karma-mocha-reporter'
        ]
    });
};