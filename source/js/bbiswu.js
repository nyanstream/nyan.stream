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

void (function(d, w, c) {
	(w[c] = w[c] || []).push(function() {
		try {
			var yandexMetrikaID = _bbiswuScriptData.bbiswuYandex

			w['yaCounter' + yandexMetrikaID] = new Ya.Metrika({
				id: yandexMetrikaID,
				clickmap: true,
				trackLinks: true,
				accurateTrackBounce: true,
				trackHash: true
			})
		} catch (e) {}
	})

	var
		n = d.getElementsByTagName('script')[0],
		s = d.createElement('script'),
		f = function() { n.parentNode.insertBefore(s, n) }

	s.async = true
	s.src = 'https://mc.yandex.ru/metrika/watch.js'

	if (w.opera == '[object Opera]') {
		d.addEventListener('DOMContentLoaded', f, false)
	} else { f() }
})(document, window, 'yandex_metrika_callbacks')
