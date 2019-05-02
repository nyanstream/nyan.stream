'use strict'

document.addEventListener('DOMContentLoaded', () => {
	let body = document.body

	/*
	 * Детект Edge
	 */

	if ('isEdge' in window && isEdge) {
		body.dataset.isEdge = true
	}

	/*
	 * Слайдер-меню
	 */

	void (() => {
		let slider = getContainer('slider')

		let trigger = $make.qs('button[data-action="sliderTrigger"]')

		let bodyData = body.dataset

		let dataItemName = 'sliderIsOpen'

		let $slider = {
			isOpen: () => (dataItemName in bodyData || bodyData[dataItemName] !== undefined),

			open: () => bodyData[dataItemName] = 'true',
			hide: () => delete bodyData[dataItemName],

			trigger() {
				this.isOpen() ? this.hide() : this.open()
			},

			triggerOutside(eventTarget) {
				if (!this.isOpen()) { return }

				let target = eventTarget

				if (target !== slider && !slider.contains(target) && target !== trigger) {
					this.hide()
				}
			},
		}

		trigger.addEventListener('click', () => $slider.trigger())

		if (isMobile.any) {
			document.addEventListener('swiped-right', () => {
				if (!$slider.isOpen()) { $slider.open() }
			})

			document.addEventListener('swiped-left', () => {
				if ($slider.isOpen()) { $slider.hide() }
			})
		}

		// https://stackoverflow.com/a/34955953

		document.addEventListener('click', e => $slider.triggerOutside(e.target))

		// Глобальный доступ к функции-триггеру слайдера через переменную $slider
		// например: $slider.trigger()

		window['$slider'] = Object.create({
			trigger: $slider.trigger
		})
	})()

	/*
	 * Добавление к локальным ссылкам расширения '.html' в режиме разработчика
	 */

	void (() => {
		if (IS_DEBUG_MODE) {
			let siteLinks = $make.qs('a[href^="/"]:not([href="/"]):not([href^="/app--"]):not([href^="/rdr--"])', ['a'])

			siteLinks.forEach(link => {
				link.setAttribute('href', `${link.getAttribute('href')}.html`)
			})
		}
	})()

	/*
	 * Установка Service Worker
	 */

	void (() => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register(
				`/service-worker.min.js?v=${getInfoFromMeta('version')}`,
				{ scope: '/' }
			).then(reg => {
				if (reg.installing) {
					console.info('Service Worker установлен.')
				} else if (reg.waiting) {
					console.info('Service Worker устанавливается...')
				} else if (reg.active) {
					console.info('Service Worker активен.')
				}
			}).catch(e => console.warn('Установка Service Worker закончилась с ошибкой: ' + e))
		}
	})()
})
