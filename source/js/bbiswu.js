'use strict'

/*
 * Код различных метрик
 * (название файла - сокращение от "Big brother is watching you")
 * Код специально оставлен (почти) таким же, каким был получен от сервисов аналитики, чтобы работать в большинстве браузеров
 */

var _bbiswuScriptData = document.currentScript.dataset

/*
 * Google Analytics
 */

void (function() {
	window.dataLayer = window.dataLayer || []
	function gtag() { dataLayer.push(arguments) }

	gtag('js', new Date())
	gtag('config', _bbiswuScriptData.bbiswuGoogle)
})()

/*
 * Yandex.Metriсa
 */

void (function() {
	(function(m, e, t, r, i, k, a) {
		m[i] = m[i] || function() {
			(m[i].a = m[i].a || []).push(arguments)
		}

		m[i].l = 1 * new Date()

		k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
	})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

	ym(_bbiswuScriptData.bbiswuYandex, 'init', {
		clickmap: true,
		trackLinks: true,
		accurateTrackBounce: true,
		webvisor: true,
		trackHash: true
	})
})()
