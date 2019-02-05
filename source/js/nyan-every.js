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
		let
			trigger = $make.qs('button[data-action="sliderTrigger"]'),
			slider = getContainer('slider')

		let bodyData = body.dataset

		let dataItemName = 'sliderIsOpen'

		let $slider = {
			trigger: () => {
				if (!(dataItemName in bodyData) || bodyData[dataItemName] == '') {
					bodyData[dataItemName] = 'true'
				} else {
					delete bodyData[dataItemName]
				}
			},

			triggerOutside: eventTarget => {
				if (!(dataItemName in bodyData) || bodyData[dataItemName] == '') { return }

				let target = eventTarget

				if (target !== slider && !slider.contains(target) && target !== trigger) {
					delete bodyData[dataItemName]
		    	}
			}
		}

		trigger.addEventListener('click', () => $slider.trigger())

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
