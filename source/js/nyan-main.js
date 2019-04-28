'use strict'

void (() => {
	clientTests({ nodes: {
		container:  $make.qs('.container'),
		errorBox:   $make.qs('.error-box')
	}})
})()

/*
 * Функция для создания селектора секций (ex. вкладок)
 */

$create.tabs = selector => {
	let tabsContainer = $make.qs(selector)

	let tabsRadioBtns = $make.qsf('.tabs-radio button[data-action="selectTab"]', tabsContainer, ['a'])

	let tabs = $make.qsf('.tabs-content section[data-tab]', tabsContainer, ['a'])

	let $selectTab = tabName => {
		let _elems = [
			...tabsRadioBtns,
			...tabs
		]

		_elems.forEach(elem => {
			let elemData = elem.dataset

			if ('tabActive' in elemData) {
				delete elemData.tabActive
			}

			if (elemData.tab == tabName) {
				elemData.tabActive = ''
			}
		})
	}

	tabsRadioBtns.forEach(btn => {
		btn.addEventListener('click', e =>
			!('tabActive' in e.target.dataset)
				? $selectTab(e.target.dataset.tab)
				: void(0)
		)
	})

	$selectTab(
		('tabDefault' in tabsContainer.dataset)
			? tabsContainer.dataset.tabDefault
			: tabs[0].dataset.tab
	)

	// Глобальный доступ к функции-селектору секции через переменную $tabs
	// например: $tabs['.sidebar'].selectTab('news')

	let _tabsGlobalVarName = '$tabs'

	if (!(_tabsGlobalVarName in window)) {
		window[_tabsGlobalVarName] = {}
	}

	window[_tabsGlobalVarName][`${selector}`] = {
		selectTab: $selectTab
	}
}

/*
 * Инициация плеера
 */

let $init = {
	player: ({ playerName = true }) => {
		let
			player =       $make.qs('.player'),
			playerEmbed =  $make.qsf('.embed', player),
			playerFrame =  $create.elem('iframe')

		let playersPath = getInfoFromMeta('players-path')

		let _metaInfoHash = getInfoFromMeta('player-hash')
		let playerHash = _metaInfoHash
			? '#' + encodeURIComponent(_metaInfoHash)
			: ''

		let _metaInfoVersion = getInfoFromMeta('version')
		let projectVersion = _metaInfoVersion
			? '?v=' + encodeURIComponent(_metaInfoVersion)
			: ''

		let playerURL = ''

		playerEmbed.textContent = ''

		if (playerName == true) {
			playerName = STRINGS.defaultPlayerName
		}

		switch (playerName) {
			case 'twitch-backup':
			case 'gg':
			case 'mixer':
			case 'grind':
			case 'eientei':
				playerURL = playerName; break
			case STRINGS.defaultPlayerName:
			default:
				playerURL = STRINGS.defaultPlayerName; break
		}

		getContainer('main').dataset.player = playerName

		playerFrame.setAttribute('aria-label', getString('player'))
		playerFrame.setAttribute('allowfullscreen', '')

		playerFrame.setAttribute(
			'src',
			`${playersPath}/${playerURL}.htm${projectVersion}${playerHash}`
		)

		playerEmbed.appendChild(playerFrame)
	}
}

/*
 * Запросы к API
 */

let $loadInfo = {
	schedule: () => doFetch({
		fetchURL: API.schedule,
		handler: $parser.schedule
	}),

	noti: () => doFetch({
		fetchURL: API.noti,
		handler: $parser.noti
	}),

	vkNews: () => doFetch({
		fetchURL: API.vkNews,
		handler: $parser.vkNews
	}),

	full() {
		Object.keys(this).forEach(key => (key != 'full') ? this[key]() : void(0))
	}
}

document.addEventListener('DOMContentLoaded', () => {
	let
		body = document.body,
		head = document.head

	let mainContainer = getContainer('main')

	/*
	 * Функция установки пользовательского CSS
	 * TODO: переписать это нагромождение if-ов
	 */

	let setUserCSS = (userCSS = $storage.get(STRINGS.customCSS)) => {
		let userStyleElem = $make.qsf('.user-styles', head)

		if (userCSS == '' || userCSS == null) {
			$storage.rm(STRINGS.customCSS)

			if (userStyleElem) { userStyleElem.textContent = '' }

			return
		}

		if (
			!$storage.get(STRINGS.customCSS) ||
			$storage.get(STRINGS.customCSS) != userCSS
		) {
			$storage.set(STRINGS.customCSS, userCSS)
		}

		if (
			$storage.get(STRINGS.customCSS) &&
			userStyleElem
		){
			userStyleElem.textContent = userCSS
		}
	}

	void (() => setUserCSS())()

	/*
	 * Если задан GET-запрос STRINGS.playerGETparam, то при загрузке сайта вместо стандартного выбирается другой плеер
	 */

	let playerName = 'twitch-main' // стандартный плеер

	void (() => {
		let _playerNameFromMeta = getInfoFromMeta('default-player')

		if (_playerNameFromMeta && _playerNameFromMeta != playerName) {
			playerName = _playerNameFromMeta
		}

		let playerNameFromURL = $check.get(STRINGS.playerGETparam)

		if (playerNameFromURL) {
			playerName = playerNameFromURL
		}
	})()

	/*
	 * Инициации
	 */

	$init.player({ playerName: playerName })
	$loadInfo.full()

	$create.tabs('.sidebar')

	/*
	 * Скрытие табов
	 */

	void (() => {
		let
			containerData = mainContainer.dataset,
			trigger = $make.qs('button[data-action="sidebarTrigger"]')

		let dataItemName = 'sidebarHidden'

		trigger.addEventListener('click', e => {
			if (!(dataItemName in containerData) || containerData[dataItemName] == '') {
				containerData[dataItemName] = 'true'
			} else {
				delete containerData[dataItemName]
			}
		})
	})()

	/*
	 * Старый цвет шапки
	 */

	void (() => {
		let
		 	bodyData = body.dataset,
			trigger = $make.qs('.sidebar button[data-tab="chat"]')

		let
			storageItemName = 'nyan_grayTheme',
			dataItemName = 'theme'

		if ($storage.get(storageItemName) == 'true') {
			bodyData.theme = 'gray'
		}

		if (trigger) {
			trigger.addEventListener('dblclick', () => {
				if (!(dataItemName in bodyData) || bodyData[dataItemName] == '') {
					bodyData[dataItemName] = 'gray'
					$storage.set(storageItemName, 'true')
				} else {
					delete bodyData[dataItemName]
					$storage.rm(storageItemName)
				}
			})
		}
	})()

	/*
	 * Таймер обновления информации
	 */

	void (() => {
		let sidebar = $make.qs('.sidebar')

		let
			tabSсhed = $make.qsf('section[data-tab="sched"]', sidebar),
			tabNews = $make.qsf('section[data-tab="news"]', sidebar)

		setInterval(() => {
			$loadInfo.noti()

			/*
			 * Экономия трафика на мобилках
			 * (если сайт открыт с мобилки, то информация во нужной вкладке будет обновляться только тогда, когда она будет открыта)
			 * TODO: сделать опцию с отключением фичи
			 */

			if (isMobile.any) {
				if ('tabActive' in tabSсhed.dataset) {
					$loadInfo.schedule()
				}

				if ('tabActive' in tabNews.dataset) {
					$loadInfo.vkNews()
				}
			} else {
				$loadInfo.schedule()
				$loadInfo.vkNews()
			}
		}, 10000)
	})()

	/*
	 * Перезагрузка плеера по клику на лого в шапке
	 */

	void (() => {
		let nyanLogo = $make.qs('.header .brand .brand__logo')
		if (nyanLogo) {
			nyanLogo.addEventListener('dblclick', () => {
				$init.player({ playerName: getContainer('main').dataset.player })
			})
		}
	})()

	void (() => {
		let _trigger = $make.qs('button[data-action="optionsTrigger"]')

		let optionsDialog = $make.qs('.dialog.dialog--options')

		if (
			!(typeof HTMLDialogElement === 'function') &&
			dialogPolyfill
		) {
			dialogPolyfill.registerDialog(optionsDialog)
		}

		if (optionsDialog) {
			if (_trigger) {
				_trigger.addEventListener('click', () => {
					optionsDialog.showModal()
				})
			}

			let optionsForm = $make.qsf('form', optionsDialog)

			// унификаця, чтобы не писать это по нескольку раз в разных участках кода
			let formValues = {
				player:  'player_selector',
				l10n:    'l10n_selector',
				css:     'custom_css'
			}

			let formValuesKeys = Object.keys(formValues)

			let formReset = () => {
				formValuesKeys.forEach(valueKey => {
					let _optionsForm = optionsForm[formValues[valueKey]]

					switch (valueKey) {
						case 'player':
							_optionsForm.value = getContainer('main').dataset.player; break
						case 'l10n':
							_optionsForm.value = $storage.get(STRINGS.l10n); break
						case 'css':
							_optionsForm.value = $storage.get(STRINGS.customCSS); break

					}
				})
			}

			formReset()

			$make.qsf('button[data-action="options-close"]', optionsDialog)
				.addEventListener('click', () => optionsDialog.close())

			optionsForm.addEventListener('reset', e => {
				e.preventDefault()
				formReset()
				optionsDialog.close()
			})

			optionsForm.addEventListener('submit', e => {
				let values = {}

				formValuesKeys.forEach(valueKey => {
					values[valueKey] = e.target[formValues[valueKey]].value
				})

				if (values.player != getContainer('main').dataset.player) {
					$init.player({ playerName: values.player })

					if (values.player == STRINGS.defaultPlayerName) {
						modifyLocSearchParam({
							param: STRINGS.playerGETparam,
							remove: true
						})
					}

					if (
						values.player != STRINGS.defaultPlayerName &&
						$check.get(STRINGS.playerGETparam) != true
					) {
						modifyLocSearchParam({
							param: STRINGS.playerGETparam,
							value: values.player
						})
					}
				}

				if (values.l10n != $storage.get(STRINGS.l10n)) {
					$storage.set(STRINGS.l10n, values.l10n)
					l10n()
				}

				if (values.css != $storage.get(STRINGS.customCSS)) {
					if (values.css == void(0)) { values.css = '' }
					setUserCSS(values.css)
				}
			})
		}
	})()
})
