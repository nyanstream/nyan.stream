'use strict'

let project = require('./package.json')

/* Подключение встроенных модулей к проекту */

let fs = require('fs'), path = require('path')

/* Подключение Gulp к проекту */

let gulp = require('gulp')

/* Подключение сторонних плагинов Gulp к проекту */

let
	tube =			require('gulp-pipe'),
	bom =			require('gulp-bom'),
	rename =		require('gulp-rename'),
	watch =			require('gulp-watch'),
	clean =			require('gulp-clean'),
	plumber =		require('gulp-plumber'),
	cleanCSS =		require('gulp-clean-css'),
	pug =			require('gulp-pug'),
	transformJSON =	require('gulp-json-transform')

/*  Подключение сторонних модулей к проекту */

let
	CLIargs =       require('yargs').argv,
	parseYAML =		require('js-yaml'),
	liveServer =	require('browser-sync')

let sass = {
	compile:  require('gulp-sass'),
	watch:    require('gulp-watch-sass'),
	vars:     require('gulp-sass-vars')
}

let uglify = {
	core:      require('terser'),
	composer:  require('gulp-uglify/composer')
}

let
	minifyJS = uglify.composer(uglify.core, console),
	reloadServer = () => liveServer.stream()

let parseYAMLfile = fileName => parseYAML.load(fs.readFileSync(`./${fileName}.yaml`, 'utf8'))

let getPackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`))

let config = parseYAMLfile('project-config')

let vendors = parseYAMLfile('project-vendors')

let dirs = config.dirs

const IS_PROD = 'prod' in CLIargs

const ASSETS_HOST = IS_PROD ? config.URLs.CDN : ''

let paths = {
	html: {
		dev: [`${dirs.dev}/pug/**/*.pug`, `!${dirs.dev}/pug/inc/**/*.pug`],
		prod: `${dirs.build}/`,
	},

	js: {
		dev:    [`${dirs.dev}/js/**/*.js`, `!${dirs.dev}/js/service-worker.js`, `!${dirs.dev}/js/finished-events/*.js`],
		dev_sw:  `${dirs.dev}/js/service-worker.js`,

		prod:          `${dirs.build}/${dirs.assets}/js/`,
		prod_vendors:  `${dirs.build}/${dirs.assets}/js/vendors/`,

		vendors: {
			kamina: `${getPackageDir('kamina-js')}/dist/kamina.min.js`,
			swipe: `${getPackageDir('swiped-events')}/dist/swiped-events.min.js`,
		},
	},

	css: {
		dev:   `${dirs.dev}/scss/**/*.scss`,
		prod:  `${dirs.build}/${dirs.assets}/css/`,
	},
}

gulp.task('liveReload', () => liveServer({
	server: [dirs.build, dirs.dist_content],
	port: 8080,
	notify: false
}))

/* Сборка pug */

let pugTubes = [
	plumber(),
	pug({ locals: {
		VERSION:     project.version,

		meta: {
			title:        config.title,
			title_alt:    config.title_alt,
			description:  config.description,
			email:        config.email,
		},

		domain:      config.domain,

		primeColor:  config.prime_color,

		PATHS: {
			js:       `${ASSETS_HOST}/${dirs.assets}/js`,
			css:      `${ASSETS_HOST}/${dirs.assets}/css`,
			img:      `${ASSETS_HOST}/${dirs.assets}/img`,
			other:    `${ASSETS_HOST}/${dirs.assets}/other`,
			players:  `/players`,
		},

		LIBS: vendors,

		BBISWU: {
			google: config.trackers.google,
			yandex: config.trackers.yandex
		},

		IS_PROD: IS_PROD,

		URLs: config.URLs,

		PLAYERS: config.PLAYERS,
	}}),
	bom(),
	rename(file => {
		switch (file.dirname) {
			case 'players':
			case 'apps':
				file.extname = '.htm'
		}

		if (file.basename == 'sitemap') {
			file.extname = '.xml'
		}
	}),
	gulp.dest(paths.html.prod)
]

gulp.task('pug:build', () => tube(
	[gulp.src(paths.html.dev)]
		.concat(pugTubes)
))

gulp.task('pug:dev', () => tube(
	[watch(paths.html.dev, { ignoreInitial: false })]
		.concat(pugTubes, [reloadServer()])
))

/* Сборка вебманифеста */

let manifestTubes = [
	plumber(),
	transformJSON((data, file) => {
		data.icons.forEach(icon => {
			icon.src = `${ASSETS_HOST}/${dirs.assets}/img/${icon.src}?v=${project.version}`
		})

		data.name =        config.title
		data.short_name =  config.title_alt

		data.theme_color = config.prime_color

		return data
	}),
	rename('nyan.webmanifest'),
	gulp.dest(paths.html.prod)
]

gulp.task('webmanifest:build', () => tube(
	[gulp.src(`${dirs.dev}/webmanifest.json`)]
		.concat(manifestTubes)
))

gulp.task('webmanifest:dev', () => tube(
	[watch(`${dirs.dev}/webmanifest.json`, { ignoreInitial: false })]
		.concat(manifestTubes, [reloadServer()])
))

/* Сборка JS */

let jsTubes = (dest = paths.js.prod) => [
	plumber(),
	minifyJS({}),
	bom(),
	rename({ suffix: '.min' }),
	gulp.dest(dest)
]

gulp.task('js:assets:build', () => tube(
	[gulp.src(paths.js.dev)]
		.concat(jsTubes())
))

gulp.task('js:assets:dev', () => tube(
	[watch(paths.js.dev, { ignoreInitial: false })]
		.concat(jsTubes(), [reloadServer()])
))

gulp.task('js:service-worker:build', () => tube(
	[gulp.src(paths.js.dev_sw)]
		.concat(jsTubes(paths.html.prod))
))

gulp.task('js:service-worker:dev', () => tube(
	[watch(paths.js.dev_sw, { ignoreInitial: false })]
		.concat(jsTubes(paths.html.prod), [reloadServer()])
))

gulp.task('js:get-vendors', () => tube([
	gulp.src(Object.values(paths.js.vendors)),
	bom(),
	gulp.dest(paths.js.prod_vendors)
]))

/* Сборка SCSS */

let scssTubes = [
	plumber(),
	sass.vars({
		VERSION:     project.version,

		primeColor:  config.prime_color,

		imgPath:     `${ASSETS_HOST}/${dirs.assets}/img`,

		otherPath:   `${ASSETS_HOST}/${dirs.assets}/other`,
	}, { verbose: false }),
	sass.compile({ outputStyle: 'compressed' }),
	cleanCSS(),
	rename({ suffix: '.min' }),
	bom(),
	gulp.dest(paths.css.prod)
]

gulp.task('scss:build', () => tube(
	[gulp.src(paths.css.dev)]
		.concat(scssTubes)
))

gulp.task('scss:dev', () => tube(
	[sass.watch(paths.css.dev)]
		.concat(scssTubes, [reloadServer()])
))

/* Копирование файлов из dirs.build и dirs.dist_content в одну общую dirs.dist */

gulp.task('dist:copy', () => tube([
	gulp.src([
		`${dirs.build}/**/*`, `${dirs.build}/**/.*`,
		`${dirs.dist_content}/**/*`, `${dirs.dist_content}/**/.*`
	]),
	gulp.dest(dirs.dist)
]))

gulp.task('dist:clean', () => tube([
	gulp.src(dirs.dist, { read: false, allowEmpty: true }),
	clean()
]))

gulp.task('dist', gulp.series('dist:clean', 'dist:copy'))

/* Команды для сборки и разработки */

gulp.task('build', gulp.parallel('pug:build', 'webmanifest:build', 'js:assets:build', 'js:service-worker:build', 'js:get-vendors', 'scss:build'))

gulp.task('build:clean', () => tube([
	gulp.src(dirs.build, { read: false, allowEmpty: true }),
	clean()
]))

gulp.task('dev', gulp.parallel('liveReload', 'pug:dev', 'webmanifest:dev', 'js:assets:dev', 'js:service-worker:dev', 'js:get-vendors', 'scss:dev'))

gulp.task('default', gulp.series('build:clean', 'build', 'dist'))
