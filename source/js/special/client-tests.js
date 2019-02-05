'use strict'

/*
 * Функция для проверки клиента на совместимость с сайтом
 * * подключать строго после langs.js!
 */

let clientTests = ({ nodes = { container, errorBox } }) => {
	if (!nodes.container.nodeName || !nodes.errorBox.nodeName) { return }

	let
		mainContainer =      nodes.container,
		mainContainerData =  mainContainer.dataset

	let
		errorBox =     nodes.errorBox,
		errorBoxDiv =  $create.elem('div')

	let isError = false

	if (
		'error' in mainContainerData
		&& mainContainerData.error == 'no-js'
	) {
		delete mainContainer.dataset.error

		let noscriptElems = $make.qs('noscript', ['a'])
		noscriptElems.forEach(elem => elem.remove())
	}

	errorBox.textContent = ''

	if (!$storage.test()) {
		mainContainer.dataset.error = 'no-ls'
		errorBoxDiv.innerHTML = `<p>${getString('err_ls')}</p><br><p>${getString('err_ls_pls')}</p>`
		isError = true
	}

	if (isError) {
		errorBoxDiv.innerHTML += `<p>${getString('err_end')}</p><p><br>${getString('tnx')}! :3</p>`

		errorBox.appendChild(errorBoxDiv)
	}
}
