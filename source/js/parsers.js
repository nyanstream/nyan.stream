'use script'

/*
 * Парсеры для различных API и прочего (но пока только API)
 * Файл зависим от core.js
 */

/*
 * Вспомогательная функция, которая очищает элемент
 * (принцип взят здесь: goo.gl/VXbjoZ)
 */

let clearNode = _node => {
	while (_node.firstChild) {
		_node.removeChild(_node.firstChild)
	}
}

/*
 * Вспомогательная функция, которая копирует контент из одной ноды в другую при условии, что их контент неодинаков
 * (принцип взят здесь: stackoverflow.com/a/955914 и немного допилен, потому что просто голое сравнение родительских нод оказалось неоч из-за того, что сравниваются в том числе и всякие элементы, навешанные на копируемый элемент, то есть классы, дата-атрибуты и т.д.)
 */

let cloneNode = (fromNode, toNode) => {
	let fromNodeTmp = fromNode.cloneNode(true)

	let toNodeTmp = toNode.cloneNode(true)

	Array.from([fromNodeTmp, toNodeTmp]).forEach(node =>
		Array.from(node.attributes).forEach(attr =>
			node.removeAttribute(attr.name)
		)
	)

	if (!fromNodeTmp.isEqualNode(toNodeTmp)) {
		clearNode(toNode)

		while (fromNode.firstChild) {
			toNode.appendChild(fromNode.firstChild)
		}

		fromNode.remove()
	}

	Array.from([fromNodeTmp, toNodeTmp]).forEach(node =>
		node.remove()
	)
}

let $parser = {
	schedule: ({ data = [], options = {}, fetchFailed = false, errorData = false }) => {
		if (fetchFailed) { console.warn(errorData); return }

		let disabledSections = ('disabledSections' in options)
			? options.disabledSections
			: []

		let schedClassName = 'schedule'

		let schedItemClassName = 'sched-item'

		let streamSсhed = $make.qs('.' + schedClassName)

		let schedItems = $create.elem('div')
		let schedItemsContent = $create.elem('div')

		Array.from([schedItems, schedItemsContent]).forEach(list => {
			list.classList.add(`${schedClassName}__items`)
			list.setAttribute('aria-role', 'list')
		})

		if (!streamSсhed.hasChildNodes()) {
			streamSсhed.appendChild($create.elem('div', '', `${schedClassName}__head`))
			streamSсhed.appendChild(schedItems)
		}

		let schedHead = $make.qsf(
			'.' + `${schedClassName}__head`,
			streamSсhed
		)

		schedHead.textContent = ''

		schedItems = $make.qsf(
			'.' + schedItems.classList.value,
			streamSсhed
		)

		/*
		 * Ранее здесь вместо дня со времени начала эпохи Unix вычислялся номер дня в году.
		 * Это приводило к тому, что, например, если скрипт видел, что текущая дата – 2017 год, а дата item – 2018, то этот item просто-напросто не показывался, так как отсекался по первому исключению в списке if ниже.
		 */

		let unixToDays = ts => Math.floor(ts / 60 / 60 / 24)

		let unixNow = moment().unix()
		let yearNow = moment().year()
		let dayNow = unixToDays(unixNow)

		let nextAirs = data.filter(item => item.s > unixNow)

		//let getDuration = d => moment.duration({ seconds: d }).humanize()

		let getDuration = d => {
			let duration = moment.duration({ seconds: d })

			let hours = duration.asHours()

			let text = (hours <= 21)
				? duration.humanize()
				: 'около дня'

			return (hours < 24) ? text : 'больше дня'
		}

		let createSchedItem = ({ item, prevItem }) => {
			if ('secret' in item && item.secret == true) { return }

			let itemStartTime = item.s, itemDuration = item.d

			if (!('e' in item)) { item['e'] = itemStartTime + itemDuration }

			let itemEndTime = item.e

			let itemStartTime_m = moment.unix(itemStartTime)

			let itemStartTimeDay = unixToDays(itemStartTime)

			let itemStatus = ''

			if (
				(itemStartTimeDay - dayNow) < -1
			) { // если (день даты старта item минус текущий день) меньше -1
				return
			} else if (
				itemStartTime < unixNow &&
				unixNow < itemEndTime
			) { // если (таймштамп времени начала item меньше, чем текущий Unix-таймштамп) И если (текущий Unix-таймштамп меньше, чем время окончания item)
				itemStatus = 'current'
			} else if (
				itemStartTime > unixNow &&
				itemStartTime == nextAirs[0]['s']
			) { // если (таймштамп времени начала item больше, чем текущий Unix-таймштамп) И если (таймштамп времени начала item равен времени начала первого item из массива будущих эфиров)
				itemStatus = 'next'
			} else if (
				itemStartTime < unixNow
			) { // если (таймштамп времени начала item меньше, чем текущий Unix-таймштамп)
				itemStatus = 'finished'
			} else if (
				itemStartTimeDay > dayNow
			) { // если (день даты старта item больше, чем текущий день)
				itemStatus = 'notToday'
			} else { void(0) }

			let itemStartTimeYear = itemStartTime_m.year()

			let schedItem = $create.elem('div', '', schedItemClassName)

			if (itemStatus != '') {
				schedItem.dataset.status = itemStatus
			}

			schedItem.setAttribute('aria-role', 'listitem')

			let scheditemTitle = $create.elem(
				'div', item.title,
				`${schedItemClassName}__title`
			)

			schedItem.appendChild(scheditemTitle)

			let schedItemData = $create.elem(
				'div', '',
				`${schedItemClassName}__data`
			)

			schedItem.appendChild(schedItemData)

			let itemDataStart = $create.elem(
				'time', `${itemStartTime_m.format(`D MMMM${yearNow !== itemStartTimeYear ? ' Y' : ''}, HH:mm`)}`,
				`${schedItemClassName}__startTime`
			)

			itemDataStart.dateTime = itemStartTime_m.format()

			schedItemData.appendChild(itemDataStart)

			let itemDataDuration = $create.elem(
				'div', '',
				`${schedItemClassName}__duration`
			)

			// для того, чтобы корректно работало ::first-letter
			itemDataDuration.appendChild($create.elem(
				'span', 'Длится ' + getDuration(itemDuration)
			))

			itemDataDuration.setAttribute('title', `${getString('end_time')}: ${moment.unix(itemEndTime).format('D MMMM, HH:mm')}`)

			schedItemData.appendChild(itemDataDuration)

			let itemDataPhrase = $create.elem(
				'div', '',
				`${schedItemClassName}__phrase`
			)

			let itemDataPhraseSpan = $create.elem('span')

			let isCollision = prevItem
				? (prevItem.e == item.s)
				: false

			switch (itemStatus) {
				case 'next':
					itemDataPhraseSpan.textContent = isCollision ? getString('next') : itemStartTime_m.fromNow()
					break;

				case 'current':
					itemDataPhraseSpan.textContent = getString('now')(moment.unix(itemEndTime).toNow(true))
					break;
			}

			if (itemDataPhraseSpan.textContent.trim() !== '') {
				itemDataPhrase.appendChild(itemDataPhraseSpan)

				schedItemData.appendChild(itemDataPhrase)
			}

			if ('link' in item && item.link !== '') {
				let itemDataLinkParent = $create.elem(
					'div', '',
					`${schedItemClassName}__link`
				)

				let itemDataLink = $create.link(
					item.link, getString('link'), '', ['e']
				)

				itemDataLinkParent.appendChild(itemDataLink)

				schedItemData.appendChild(itemDataLinkParent)
			}

			return schedItemsContent.appendChild(schedItem)
		}

		data.forEach((item, i) => createSchedItem({ item: item, prevItem: data[i-1] ? data[i-1] : null }))

		if (!disabledSections.includes('latestCheck')) {
			schedHead.appendChild($create.elem(
				'span',
				`${getString('latest_check')}: ${moment().format('D MMMM, HH:mm:ss')}`
			))
		}

		if (
			!schedItemsContent.hasChildNodes() &&
			!disabledSections.includes('emptySchedule')
		) {
			let emptyNodeContent = $create.elem(
				'div', '',
				`${schedItemClassName}__empty`
			)

			emptyNodeContent.appendChild($create.text(`${getString('empty_schedule')} `))

			emptyNodeContent.appendChild($create.elem(
				'span', '¯\\_(ツ)_/¯'
			))

			schedItemsContent.appendChild(emptyNodeContent)
		}

		cloneNode(schedItemsContent, schedItems)
	},

	vkNews: ({ data = {}, fetchFailed = false, errorData = false }) => {
		let vkNews = $make.qs('.vk-posts')

		let apiErrorClass = 'api-err'

		if (fetchFailed || !('posts' in data)) {
			vkNews.classList.add(apiErrorClass)

			clearNode(vkNews)

			vkNews.appendChild($create.elem('p', getString('err_api')))

			if (errorData) { console.warn(errorData) }

			return
		} else {
			if (vkNews.classList.contains(apiErrorClass)) {
				vkNews.classList.remove(apiErrorClass)
			}
		}

		let vkNewsContent = $create.elem('div')

		data['posts'].forEach(post => {
			if (post['pin'] == 1) { return }

			let postImgLink = ''

			let postImg = post['pic']

			if (postImg) {
				let	postImgElem = $create.elem('img')

				postImgElem.setAttribute('src', postImg['small'])
				postImgElem.setAttribute('alt', '')

				postImgLink = $create.link(postImg['big']
					? postImg['big']
					: postImg['small'])

				postImgLink.classList.add('vk-post-img-link')
				postImgLink.appendChild(postImgElem)
			}

			let text = post['text'].replace(/\n/g, '<br>')

			// https://git.io/fxvBn
			let vkLinksRegExp = /\[((?:id|club)\d+)\|([^\]]+)\]/

			let vkLinksInText = text.match(
				new RegExp(vkLinksRegExp, 'g')
			)

			if (vkLinksInText) {
				vkLinksInText.forEach(link => {
					let linkTmp = link.split('|')

					text = text.replace(
						vkLinksRegExp,
						$create.link(
							`https://${DOMAINS.vk}/${linkTmp[0]
								.replace(/\[/g, '')}`,
							linkTmp[1].replace(/]/g, ''),
							'',
							['e', 'html']
						)
					)
				})
			}

			let vkPostMetaLink = $create.link(
				`https://${DOMAINS.vk}/wall-${data['com']['id']}_${post['id']}`,
				moment.unix(post['time']).format('LLL'),
				'',
				['e', 'html']
			)

			let isCopy = ''

			if (post['type'] == 'copy') {
				isCopy = ' is-repost'
				vkPostMetaLink += ` <span title="${getString('vk_repost')}">\u2935</span>`
			}

			let vkPost = $create.elem('div', '', 'vk-post' + isCopy)

			let vkPostMeta = $create.elem('div', vkPostMetaLink, 'vk-post-meta')

			let vkPostBody = $create.elem('div', '', 'vk-post-body')

			if (postImgLink) { vkPostBody.appendChild(postImgLink) }

			vkPostBody.appendChild($create.elem('p', text))

			vkPost.appendChild(vkPostMeta)
			vkPost.appendChild(vkPostBody)

			vkNewsContent.appendChild(vkPost)
		})

		cloneNode(vkNewsContent, vkNews)
	},

	noti: ({ data = {}, options = {}, fetchFailed = false, errorData = false }) => {
		let notiElem = $make.qs('.noti')

		let notiItems = []

		let _storageNotiItemName = STRINGS.notiItem

		if ($storage.get(_storageNotiItemName)) {
			notiItems = JSON.parse($storage.get(_storageNotiItemName))
		}

		// @TODO: сделать удаление из хранилища всех оповещений, которые были внесены более какого-то периода (например, более двух недель) назад

		let
			notiID =     ('time' in data) ?   data.time :   '',
			notiText =   ('text' in data) ?   data.text :   '',
			notiColor =  ('color' in data) ?  data.color :  ''

		if (
			fetchFailed ||
			!('enabled' in data) ||
			data.enabled == false ||
			notiItems.includes(notiID)
		) {
			delete notiElem.dataset.notiIsEnabled
			if (errorData) { console.warn(errorData) }
			return
		} else {
			notiElem.dataset.notiIsEnabled = ''
		}

		notiElem.style.backgroundColor = notiColor ? notiColor : null

		let
			notiContent = $make.qsf('.noti__content', notiElem)
			notiHideBtn = $make.qsf('.noti__hide-btn', notiElem)

		let notiContentBody = $create.elem('div')

		notiContentBody.innerHTML = notiText

		let notiProhibitedElemsTrigger = 'script, style, *[onload], *[onerror], *[onabort]'

		if ($make.qsf(notiProhibitedElemsTrigger, notiContentBody)) {
			$make.qsf(notiProhibitedElemsTrigger, notiContentBody, ['a']).forEach(_script => _script.remove())
		}

		if ($make.qsf('a[href]', notiContentBody)) {
			let notiLinks = $make.qsf('a[href]', notiContentBody, ['a'])

			notiLinks.forEach(link => {
				link.setAttribute('target', '_blank')
				if (link.getAttribute('href').startsWith('http')) {
					link.setAttribute('rel', 'nofollow noopener')
				}
			})
		}

		cloneNode(notiContentBody, notiContent)

		notiHideBtn.onclick = () => {
			notiItems.push(notiID)
			$storage.set(_storageNotiItemName, JSON.stringify(notiItems))

			notiElem.style.display = 'none'
			delete notiElem.dataset.notiIsEnabled
		}
	}
}
