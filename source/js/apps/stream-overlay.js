'use strict'

moment.tz.setDefault('Europe/Moscow')

sessionStorage.clear()

let getOverlay = (x, y) => {
	if (!x || !y) { return }

	return $make.qs(`.overlay__data[data-postiton='${x} ${y}']`)
}

let setIntervalAndExecute = (fnc, time) => {
	fnc()
	return setInterval(fnc, time)
}

let $embed = {
	time: elem => {
		let time = moment().format('HH:mm')
		if (elem.textContent != time) {
			elem.textContent = time
		}
	},
	title: elem => {
		doFetch({ fetchURL: API.schedule, handler: ({ data = [], fetchFailed = false, errorData }) => {
			if (fetchFailed) { console.warn(errorData) }

			let unixNow = moment().unix()

			let nextAirs = data.filter(e => e['s'] > unixNow)

			let titleStorageItemName = '_SchedItem'

			let checkTitleItem = itemTitle => {
				if (!sessionStorage.getItem(titleStorageItemName) || sessionStorage.getItem(titleStorageItemName) != itemTitle) {
					sessionStorage.setItem(titleStorageItemName, itemTitle)
				}
			}

			for (let item of data) {
				if (item['s'] < unixNow && unixNow < item['e']) {
					checkTitleItem(item['title'])

					if (sessionStorage.getItem(titleStorageItemName) != elem.dataset.currentAir) {
						//elem.classList.toggle('changed')

						elem.textContent = `${sessionStorage.getItem(titleStorageItemName)}`
						elem.dataset.currentAir = sessionStorage.getItem(titleStorageItemName)
					}

					break
				} else if (item['s'] > unixNow && item['s'] == nextAirs[0]['s']) {
					checkTitleItem(item['title'])

					if (sessionStorage.getItem(titleStorageItemName) != elem.dataset.nextAir) {
						elem.innerHTML = `<b>${getString('within')} ${moment.unix(item['s']).fromNow()}:</b> ${sessionStorage.getItem(titleStorageItemName)}`
						elem.dataset.nextAir = sessionStorage.getItem(titleStorageItemName)
					}

					break
				}
			}
		}})
	}
}

document.addEventListener('DOMContentLoaded', () => {
	let topLeftOverlay = getOverlay('top', 'left')

	void (() => {
		if (IS_DEBUG_MODE) {
			document.body.dataset.isDebugMode = ''
		}
	})()

	void (() => {
		let timeElem = $make.qsf('.time datetime', topLeftOverlay)

		setIntervalAndExecute(() => {
			$embed.time(timeElem)
		}, 1000)

		let titleElem = $make.qsf('.title div', topLeftOverlay)

		setIntervalAndExecute(() => {
			$embed.title(titleElem)
		}, 5000)
	})()
})
