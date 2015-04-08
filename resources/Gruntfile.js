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

		// https://github.com/gruntjs/grunt-contrib-compass
		compass: {
			dist: {
				options: {
					// Config.rb für Compass. Die Konfiguration kann auch direkt hier hinein geschrieben werden,
					// ist aber weniger übersichtlich.
					// Wir legen deswegen eine zusätzliche config.rb an.
					config: 'config.rb'
				}
			}
		},

		// https://github.com/gruntjs/grunt-contrib-concat
		concat: {
			dist: {
				// Welche Dateien sollen zusammengefasst werden?
				// In welcher Reihenfolge?
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
					// Erstellt eine sourceMap, mit der in der
					// Browser Console die richtige Code-Zeile
					// für Debug-Zwecke gefunden werden kann.
					sourceMap: false
				},
				// Wohin soll die Uglify-Datei gespeichert werden?
				files: {
					'<%= globalConfig.scripts %>/main.min.js': ['<%= globalConfig.scripts %>/main.min.js']
				}
			}
		},

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

		// https://github.com/andismith/grunt-responsive-images
		responsive_images: {
			retina: {
				options: {
					// Benutze Library: im = ImageMagick, gm = GraphicsMagick
					engine: 'gm',
					separator: '',
					sizes: [{
						// Original-Namen behalten
						rename: false,
						quality: 85,
						// Die Bilder werden in ihrer Größe halbiert.
						width: '50%'
					},{
						rename: false,
						quality: 85,
						width: '100%',
						// Für die Retina-Bilder wird ein Suffix vergeben,
						// das an den Originalnamen angehängt wird.
						suffix: '@2x'
					}]
				},
				files: [{
					expand: true,
					// Welche Dateitypen sollen von diesem Task überhaupt betroffen sein?
					src: ['**/**.{jpg,gif,png}'],
					// Ausgangsorder, hier liegen die Originaldateien.
					cwd: '<%= globalConfig.images_src %>/',
					// Zielordner, hier werden die Bilder abgelegt.
					dest: '<%= globalConfig.images %>/'
				}]
			}
		},

		// https://github.com/gruntjs/grunt-contrib-imagemin
		// Beispielbilder von Raumrot http://www.raumrot.com/
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

		// https://www.npmjs.com/package/grunt-favicons
		favicons : {
			options: {
				// Hintergrundfarbe für das Apple Touch Icon
				appleTouchBackgroundColor: "#000000",
				// Erstelle ein Icon für den Android Home Screen
				androidHomescreen: true,
				// Erstelle eine HTML-Datei, in der alle notwendigen Meta-Tags eingebunden sind.
				html: '<%= globalConfig.images %>/favicon-test.html',
				HTMLPrefix: "",
				// Tile Farbe für Windows
				tileColor: "#000000",
				// Das muss auf false gesetzt werden, damit die tileColor Einstellung greift.
				tileBlackWhite: false
			},
			icons: {
				src: '<%= globalConfig.images_src %>/favicon.png',
				dest: '<%= globalConfig.images %>'
			}
		},

		// https://www.npmjs.com/package/grunt-browser-sync
		// http://www.browsersync.io/docs/options/
		browserSync: {
			// Wenn Änderungen an diesen Dateien festegestellt werden, lade alle Fenster neu!
			bsFiles: {
				src : [
					'../public_html/css/*.css',
					'../public_html/*.html'
				]
			},
			options: {
				debugInfo: true,
				logConnections: true,
				notify: true,
				// Wie die Webseite im Browser aufgerufen wird.
				// Kann ebenso localhost oder eine IP sein.
				// ACHTUNG: Domains mit .local funktionieren nicht richtig!
				proxy: "grunt-webseite.dev",
				// Öffne die Seite in folgenden Browsern
				browser: ["google chrome", "firefox"],
				ghostMode: {
					// Scrolle auf allen Geräten
					scroll: true,
					// Folge den Links auf allen Geräten
					links: true,
					// Fülle die Formulare auf allen Geräten aus
					forms: true
				}
			}
		},

		// https://github.com/sindresorhus/grunt-shell
		shell: {
			workflow: {
				command: [
					'cd ..',
					'git pull',
					'cd dev/',								// nur in Verbindung mit Vagrant
					'vagrant up',							// nur in Verbindung mit Vagrant
					'open http://www.grunt-webseite.dev',	// nur in Verbindung mit Vagrant
					'cd ../resources/',
					'grunt'
				].join('&&')
			},
			installTypo3: {
				command: [
					'cd ..',
					'git submodule add git://git.typo3.org/Packages/TYPO3.CMS.git typo3_src',
					'cd typo3_src',
					'git checkout tags/TYPO3_6-2-9',
					'cd ../public_html',
					'ln -s ../typo3_src/index.php',
					'ln -s ../typo3_src/typo3'
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
	grunt.registerTask('generate-touch-icons', ['favicons']);
	grunt.registerTask('browser-sync', ['browserSync']);
	grunt.registerTask('start-workflow', ['shell:workflow']);
	grunt.registerTask('install-typo3', ['shell:installTypo3']);
};