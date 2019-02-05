'use strict'

void (() => {
	let doc = document

	let styleOf = status => doc.querySelector(`main[data-error="${status}"]`).style

	let undefinedBlock = styleOf('undefined')

	if (self != top) {
		undefinedBlock.display = 'initial'; return
	}

	fetch(document.URL)
		.then(response => {
			let status = response.status

			doc.title = `${doc.title} ${status}`

			switch (status) {
				case 403:
				case 404:
					styleOf(status).display = 'initial'; break
				case 200:
				default:
					undefinedBlock.display = 'initial'; break
			}
		})
})()
