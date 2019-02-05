'use strict'

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
