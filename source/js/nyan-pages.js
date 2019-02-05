'use strict'

void (() => {
	clientTests({ nodes: {
		container:  $make.qs('.container'),
		errorBox:   $make.qs('.error-box')
	}})
})()

document.addEventListener('DOMContentLoaded', () => {
	/*
	 * Создание на страницах якорей у заголовков
	 */

	void (() => {
		let headings = $make.qs('section h2', ['a'])

		headings.forEach(heading => {
			let section = heading.parentElement

			if (section && section.hasAttribute('id')) {
				let headingAnchor = $create.link(
					`#${section.getAttribute('id')}`,
					'',
					'anchor'
				)

				headingAnchor.setAttribute('title', getString('anchor'))

				heading.appendChild(headingAnchor)
			}
		})
	})()

	/*
	 * Специальные возможности для страницы "О проекте"
	 */

	void (() => {
		if (checkLocation('/about')) {
			// специальный блок, который показывается, если язык браузера пользователя - не русский

			let sectionNoRu = $make.qs('section[data-page-op="no-ru"]')

			let userLanguage = navigator.language || navigator.userLanguage

			if (
				sectionNoRu &&
				sectionNoRu.classList.contains('hidden') &&
				!/ru/.test(userLanguage.toLowerCase())
			) {
				sectionNoRu.classList.remove('hidden')
			}

			// если задан URL вида "example.ru/about?only#test",то скрытваются всех блоки, кроме того, что имеет якорь #test

			let locationHash = location.hash.substr(1)

			if (
				$check.get('show-only') &&
				locationHash != '' &&
				$make.qs(`section[id=${locationHash}]`)
			) {
				$make.qs(`section[id]:not([id=${locationHash}])`, ['a'])
					.forEach(section => section.classList.add('hidden'))

				$make.qs(`section[id=${locationHash}]`)
					.dataset.pageOp = 'only-mode-selected'

				$make.qs('section[data-page-op="only-mode"]')
					.classList.remove('hidden')
			}
		}
	})()
})
