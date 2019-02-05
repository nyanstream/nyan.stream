'use strict'

/*
 * Проверка на "режим разработчика"
 */

const IS_DEBUG_MODE =
	(
		location.hostname == '127.0.0.1' ||
		location.hostname == 'localhost'
	)

/*
 * Всякие разные строки для всяких разных целей
 */

const STRINGS = {
	// Название айтема в LocalStorage для локализации (langs.js)
	l10n: 'nyan_l10n',

	// Название айтема в LocalStorage для нотификаций (parsers.js)
	notiItem: 'nyan_noti',

	// GET-параметр, который позволяет выбрать плеер через URL (напр. site.com/?b=twitch)
	playerGETparam: 'b',

	// Название плеера по-умолчанию
	defaultPlayerName: 'twitch',

	// Название айтема в LocalStorage для пользовательского CSS
	customCSS: 'nyan_userCSS',
}

 /*
 * Используемые домены (их последующее изменение запрещено из соображений безопасности)
 * Сам объект не замораживается, чтобы в других скриптах была возможность добавлять другие домены
 */

const DOMAINS = {}

void(() => {
	let _DOMAINS = [
		['self', 'nyan.stream'],

		['api', 'nyan-api.blyat.science'],

		['vk', 'vk.com'],
	]

	_DOMAINS.forEach(domain => {
		Object.defineProperty(
			DOMAINS,
			domain[0],
			{
				value: domain[1],
				configurable: false,
				writable: false
			}
		)
	})
})()

/*
 * Эндпоинты API (объект замораживается из соображений безопасности)
 */

const API = {
	schedule:  'sched',
	noti:      'noti',
	vkNews:    'vk-news'
}

void(() => {
	Object.keys(API).forEach(key => {
		API[key] = `https://${DOMAINS.api}/api/${API[key]}`
	})

	Object.freeze(API)
})()

/*
 * Возврат нужного контейнера
 */

let getContainer = (mod = 'main') => $make.qs(`.container--${mod}`)

/*
 * Функция для запросов к API
 */

let doFetch = ({ fetchURL, handler, handlerOptions = {}, failData = 'fail' }) =>
	fetch(`${fetchURL}?t=${Date.now()}`, { cache: 'no-store' })
		.then(response => response.json())
		.then(data => handler({
			data: data,
			options: handlerOptions
		}))
		.catch(err => handler({
			fetchFailed: true,
			errorData: err,
			options: handlerOptions
		}))
