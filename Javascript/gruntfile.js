module.exports = function (grunt) {
	'use strict';
	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		watch: {
			scripts: {
				files: [
            'game/game.js'
        ],
				options: {
					spawn: false,
					livereload: true
				}
			}
		},
		connect: {
			livereload: {
				options: {
					port: 9000,
					hostname: 'localhost',
					open: true,
					livereload: 35729,
					base: 'game'
				}
			}
		}
	});

	grunt.registerTask('serve', ['connect:livereload', 'watch']);

};