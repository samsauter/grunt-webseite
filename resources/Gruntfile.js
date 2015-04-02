module.exports = function(grunt) {

	// Pfad-Variablen
	// Relativ zu dieser Gruntfile !!!
	var globalConfig = {
		css:			'../public_html/css',
		scss:			'scss',
		scripts:		'../public_html/js',
		scripts_src:	'js',
		images:			'../public_html/images',
		images_src:		'images'
	};

	grunt.initConfig({
		globalConfig: globalConfig,

		// https://github.com/gruntjs/grunt-contrib-watch
		// Was soll automatisch passieren, wenn der Task angestoßen wurde?
		watch: {
			// Beim Speichern von .scss Dateien
			css: {
				files: ['<%= globalConfig.scss %>/**/*.scss'],
				tasks: ['compass']
			},
			// Beim Speichern von .js Dateien
			scripts: {
				files: '<%= globalConfig.scripts_src %>/**/*.js',
				tasks: ['concat', 'uglify']
			}
		},

		// https://github.com/gruntjs/grunt-contrib-compass
		compass: {
			dist: {
				options: {
					// Config.rb für Compass. Die Konfiguration kann auch direkt hier hinein geschrieben werden, ist aber weniger übersichtlich.
					// Dafür wird zusätzlich eine config.rb benötigt.
					config: 'config.rb'
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-concat
		concat: {
			dist: {
				// Welche Dateien sollen zusammengefasst werden? In welcher Reihenfolge?
				src: [
					'<%= globalConfig.scripts_src %>/jquery-1.11.2.js',
					'<%= globalConfig.scripts_src %>/**/*.js'
				],
				// Wohin soll die konkatenierte Datei gespeichert werden?
				dest: '<%= globalConfig.scripts %>/main.min.js'
			}
		},

		// https://github.com/gruntjs/grunt-contrib-uglify
		uglify: {
			development: {
				options: {
					// Erstellt eine sourceMap, mit der in der Browser Console die richtige Code-Zeile für Debug-Zwecke gefunden werden kann
					sourceMap: false
				},
				// Wohin soll die Uglify-Datei gespeichert werden?
				files: {
					'<%= globalConfig.scripts %>/main.min.js': ['<%= globalConfig.scripts %>/main.min.js']
				}
			}
		},

		// https://github.com/andismith/grunt-responsive-images
		responsive_images: {
			retina: {
				options: {
					engine: 'gm',	// im = ImageMagick, gm = GraphicsMagick
					separator: '',
					sizes: [{
						rename: false,
						quality: 85,
						width: '50%'
					},{
						rename: false,
						quality: 85,
						width: '100%',
						suffix: '@2x'
					}]
				},
				files: [{
					expand: true,
					src: ['**/**.{jpg,gif,png}'],
					cwd: '<%= globalConfig.images_src %>/',
					dest: '<%= globalConfig.images %>/'
				}]
			}
		},

		// https://github.com/gruntjs/grunt-contrib-imagemin
		// example images from http://www.raumrot.com/
		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [{
					expand: true,
					src: ['**/*.png'],
					cwd: '<%= globalConfig.images %>',
					dest: '<%= globalConfig.images %>'
				}]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [{
					expand: true,
					src: ['**/*.{jpg,jpeg}'],
					cwd: '<%= globalConfig.images %>',
					dest: '<%= globalConfig.images %>'
				}]
			}
		},

		// https://github.com/sindresorhus/grunt-shell
		shell: {
			workflow: {
				command: [
					'cd ..',
					'git pull',
					//'cd dev/',								// nur in verbindung mit vagrant
					//'vagrant up',								// nur in verbindung mit vagrant
					//'open http://grunt-webseite.local',		// nur in verbindung mit vagrant
					'cd ../resources/',
					'grunt'
				].join('&&')
			}
		}
	});

	// Tasks laden, mit dem Plugin load-grunt-tasks
	// https://github.com/sindresorhus/load-grunt-tasks
	require('load-grunt-tasks')(grunt);

	// Definiere Tasks, die in der Kommando-Zeile aufgerufen werden können.
	// Definiere den watch task als default
	// Ausführen über $ grunt watch
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('optimize-images', ['responsive_images', 'imagemin']);
	grunt.registerTask('start-workflow', ['shell:workflow']);
};