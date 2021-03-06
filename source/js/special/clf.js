'use strict'

/*
 * Кастомные функции для взаимодействия с location
 */

let checkLocation = str => {
	let isTrue = false

	switch (location.pathname) {
		// для разработки
		case `${str}.htm`:
		case `${str}.html`:

		case str:
			isTrue = true
	}

	return isTrue
}

let modifyLocSearchParam = ({ param = '', value = '', remove = false }) => {
	let loc = location

	let _URL = new URLSearchParams(loc.search)

	if (remove == true) {
		_URL.delete(param, value)
	} else {
		_URL.set(param, value)
	}

	let newSearchString =
		(Array.from(_URL.keys()).length != 0)
			? `?${_URL.toString()}`
			: ''

	history.pushState(
		'',
		document.title,
		`${loc.pathname}${newSearchString}`
	)
}
