'use strict'

/*
 * Локализация
 * Файл зависим от core.js
 */

/*
 * Функция, возвращающая значение запрашиваемой строки из переменной trStrings
 * * *
 * У некоторых объектов, являющихся своеобразными "шаблонами" (например now), возвращается функция. В этом случае следует делать вызов следующим образом:
 * getString('now')('час') -> "Сейчас (ещё час)"
 *
 * TODO: найти время и сгруппировать всё
 */

let getString = s => {
	let trStrings = {

		about_project: {
			ru: 'О проекте',
			en: 'About us',
		},

		donate: {
			ru: 'Поддержать проект',
			en: 'Support us',
		},
		donate_report: {
			ru: 'Посмотреть отчёты',
			en: 'Reports on donations',
		},

		ext_chrome: {
			ru: 'Расширение для Chrome',
			en: 'Extension for Chrome',
		},
		ext_opera: {
			ru: 'Расширение для Opera',
			en: 'Extension for Opera',
		},

		msk_time_note: {
			ru: 'Время московское',
			en: 'Moscow time',
		},
		local_time_note: {
			ru: 'Местное время',
			en: 'Local time',
		},

		request: {
			ru: 'Сделать реквест',
			en: 'Request something',
		},
		requests_view: {
			ru: 'Посмотреть реквесты',
			en: 'View requests',
		},

		err_ls: {
			ru: 'В вашем браузере отключено сохранение данных для нашего сайта, и из-за этого он не может нормально функционировать.',
		},
		err_ls_pls: {
			ru: 'Пожалуйста, включите эту функцию.',
			en: 'Please, enable it.',
		},
		err_end: {
			ru: 'У нас круто, и это определённо будет стоить затрачанных усилий.',
			en: 'It\'s cool here, and it\'ll be tottaly worth it.',
		},
		err_api: {
			ru: 'API сайта недоступно.',
			en: 'Site API is unavailable.',
		},

		tnx: {
			ru: 'Спасибо',
			en: 'Thank you',
		},

		empty_schedule: {
			ru: 'Расписание пустое',
			en: 'Scheldue is empty',
		},

		latest_check: {
			ru: 'Последняя проверка',
			en: 'Latest check',
		},

		com_vk: {
			ru: 'Сообщество в VK',
			en: 'Сommunity on VK',
		},
		com_tg: {
			ru: 'Канал в Telegram',
			en: 'Telegram channel',
		},
		com_discord: {
			ru: 'Сервер в Discord',
			en: 'Discord server',
		},

		vk_repost: {
			ru: 'Репост',
			en: 'Repost',
		},

		noti: {
			ru: 'Оповещение',
			en: 'Notification',
		},
		noti_hide: {
			ru: 'Скрыть оповещение',
			en: 'Hide notification',
		},

		show: {
			ru: 'Показать',
			en: 'Show',
		},

		tab_sched: {
			ru: 'Расписание',
			en: 'Schedule',
			ja: '時刻表',
		},
		tab_news: {
			ru: 'Новости',
			en: 'News',
			ja: 'ニュース',
		},

		sidebar_trigger: {
			ru: 'Скрыть/показать боковую панель',
			en: 'Hide or show sidebar',
		},
		options_trigger: {
			ru: 'Открыть настройки',
			en: 'Settings',
		},

		within: {
			ru: 'Далее',
			en: 'Starts',
		},
		now: {
			ru: s => `Сейчас (ещё ${s})`,
			en: s => `Now (${s} left)`,
		},

		play: {
			ru: 'Играть',
			en: 'Play',
		},

		player: {
			ru: 'Плеер',
			en: 'Player',
		},
		chat: {
			ru: 'Чат',
			en: 'Chat',
			ja: 'チャット',
		},

		backup: {
			ru: 'на бэкапе',
			en: 'on a backup stream',
		},

		links: {
			ru: 'Ссылки',
			en: 'Links',
		},

		logo: {
			ru: 'Логотип',
			en: 'Logo',
		},

		link_shiki: {
			ru: 'Профиль на Shikimori',
			en: 'Shikimori profile'
		},
		link_trakt: {
			ru: 'Профиль на Trakt.tv',
			en: 'Trakt.tv profile'
		},
		link_rawg: {
			ru: 'Профиль на RAWG',
			en: 'RAWG profile'
		},

		made_with: {
			ru: 'сделано с',
			en: 'made with',
		},

		go_main_page: {
			ru: 'Перейти на главную',
			en: 'Go to the main page',
		},

		settings: {
			ru: 'Настройки',
			en: 'Settings',
		},

		close: {
			ru: 'Закрыть',
			en: 'Close',
		},

		save: {
			ru: 'Сохранить',
			en: 'Save',
		},

		anchor: {
			ru: 'Якорь',
			en: 'Anchor'
		},

		happy_ny: {
			ru: 'С новым годом!',
			en: 'Happy New Year!',
			ja: '明けましておめでとうございます！',
		},

		player_selector: {
			ru: 'Выбор плеера',
			en: 'Player'
		},
		l10n_selector: {
			ru: 'Выбор локализации',
			en: 'Site language'
		},
		custom_css: {
			ru: 'Свои CSS',
			en: 'Custom CSS'
		},

		// названия локализаций

		l10n_ru: {
			ru: 'Русская',
			en: 'Russian',
			ja: 'ロシア語',
		},
		l10n_en: {
			ru: 'Английская',
			en: 'English',
			ja: '英語',
		},
		l10n_ja: {
			ru: 'Японская',
			en: 'Japanese',
			ja: '日本語',
		},
	}

	let string = ''

	if ($storage.test()) {
		switch ($storage.get(STRINGS.l10n)) {
			case 'ru':
			case 'en':
			case 'ja':
				break
			default:
				$storage.set(STRINGS.l10n, 'ru')
		}
	}

	let userLang = $storage.test()
		? $storage.get(STRINGS.l10n)
		: 'ru'

	try {
		if (!(userLang in trStrings[s]) || trStrings[s][userLang] == '') { throw 42 }

		if (trStrings[s][userLang]) {
			string = trStrings[s][userLang]
		}
	} catch (e) {
		if (trStrings[s] && trStrings[s]['ru']) {
			string = trStrings[s]['ru']
		}
	}

	return string
}

let l10n = () => {
	/*
	 * Первая буква в строке становится заглавной
	 * Отсюда: https://stackoverflow.com/a/1026087
	 */

	let capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

	let l10nErr = s => console.warn(`Ошибка: cтрока "${s}" не переведена или неправильно используется`)

	/*
	 * Поиск HTML-элементов для локализации
	 * Элементы должны иметь аттрибут "data-lang" с нужным значением из переменной trStrings
	 * TODO: сделать поддержку шаблонов (например, с помощью дополнительного аттрибута "data-lang-template")
	 */

	void (() => {
		let elems = $make.qs('[data-lang]', ['a'])

		elems.forEach(elem => {
			let string = getString(elem.dataset.lang)

			if (string && string != '' && typeof string != 'function') {
				if (elem.dataset.lang.startsWith('l10n_')) {
					let _flag = ''

					switch (elem.dataset.lang.replace('l10n_', '')) {
						case 'ru':
							_flag = '🇷🇺'; break
						case 'en':
							_flag = '🇬🇧'; break;
						case 'ja':
							_flag = '🇯🇵'; break;
					}

					string = `${_flag} ${string}`
				}

				elem.textContent = string
			} else { l10nErr(elem.dataset.lang) }
		})
	})()

	/*
	 * Функция-локализатор аттрибутов у HTML-элементов
	 * Первое значение - датасет ("data-lang-SOME", напр. "data-lang-title"), второе - локализуемый аттрибут
	 * Элементы должны иметь аттрибут "data-lang-SOME" с нужным значением из переменной trStrings
	 */

	let l10nForAttrs = (arr = []) => {
		arr.forEach(arrItem => {
			let dataAttr = arrItem[0]

			let attr = arrItem[1]

			let elems = $make.qs(`[data-lang-${dataAttr}]`, ['a'])

			elems.forEach(elem => {
				let
					elemData = `lang${capitalize(dataAttr)}`,
					string = getString(elem.dataset[elemData])

				if (string && string != '' && typeof string != 'function') {
					elem.setAttribute(attr, string)
				} else { l10nErr(elem.dataset[elemData]) }
			})
		})
	}

	l10nForAttrs([
		['title', 'title'],
		['image', 'alt'],
		['label', 'aria-label'],
	])

	/* Локализация Moment.js */

	void (() => {
		if (
			'moment' in window &&
			moment() instanceof moment &&
			'locales' in moment &&
			$storage.test()
		) {
			let momentLocales = moment.locales()

			if (momentLocales.includes('ru') && momentLocales.includes('en')) {
				moment.locale($storage.get(STRINGS.l10n))
			}
		}
	})()
}

document.addEventListener('DOMContentLoaded', () => l10n())
