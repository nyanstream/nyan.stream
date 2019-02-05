'use strict'

/*
 * Большая часть кода взята отсюда:
 * https://github.com/eientei/videostreamer/blob/57b755a489cc6d34c7e90a8aae4677c68875f7c4/static/index.html
 */

document.addEventListener('DOMContentLoaded', () => {
	let time = null
	let socket = null

	let body = document.body

	let storageItemsNames = { // ¯\_(ツ)_/¯
		'volume': 'Volume',
		'state': 'State'
	}

	Object.keys(storageItemsNames).forEach(key => {
		storageItemsNames[key] = `_nyan:eienteiPlayer${storageItemsNames[key]}`
	})

	let getControl = control => $make.qs(`[data-ctrl='${control}']`)

	let fsCtrlChangeState = () => {
		/* FIXME: fix this pls */

		let _ctrl = getControl('fullscreen')

		if (_ctrl.dataset.fs == 'true') {
			delete _ctrl.dataset.fs
		} else {
			_ctrl.dataset.fs = 'true'
		}
	}

	/* https://developer.mozilla.org/ru/docs/DOM/Using_fullscreen_mode#Toggling_fullscreen_mode */

 	let toggleFullScreen = () => {
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
			let _doc = document.documentElement

			if (_doc.requestFullscreen) {
				_doc.requestFullscreen()
			} else if (_doc.mozRequestFullScreen) {
				_doc.mozRequestFullScreen()
			} else if (_doc.webkitRequestFullscreen) {
				_doc.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen()
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen()
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen()
			}
		}
	}

	let init = () => {
		if (time != null) {
			clearTimeout(time)
		}

		if (socket != null) {
			socket.close()
		}

		if (isMobile.any) {
			$make.qs('.controls').dataset.mobile = ''
		}

		let video = $make.qs('video')

		let updateVolumeLevel = () => {
			let _vol = video.volume * 100

			let _ctrl = getControl('changeMute')

			if (_vol == 0) {
				_ctrl.dataset.level = 'zero'
			} else if (_vol > 0 && _vol < 55) {
				_ctrl.dataset.level = 'low'
			} else if (_vol >= 55) {
				_ctrl.dataset.level = 'high'
			}
		}

		if ($storage.get(storageItemsNames.volume)) {
			video.volume = $storage.get(storageItemsNames.volume)
			getControl('changeVolume').value = $storage.get(storageItemsNames.volume) * 100
		} else {
			video.volume = isMobile.any ? 1 : .5
		}

		updateVolumeLevel()

		video.pause()
		video.src = ''

		video.addEventListener('progress', e => {
			if (video.buffered.length == 0) {
				return
			}

			let current = video.currentTime

			let end = video.buffered.end(video.buffered.length - 1)

			let diff = end - current

			if (diff > 1.000) {
				if (video.paused && getControl('changeState').dataset.state == 'play') {
					video.play()
				}
			} else if (diff < 0.500) {
				if (!video.paused) {
					video.pause()
				}
			}
		})

		/* TODO: fix this pls */

		getControl('changeState').addEventListener('click', e => {
			let btn = e.target

			switch (btn.dataset.state) {
				case 'pause':
					video.currentTime = video.buffered.end(video.buffered.length - 1)
					btn.dataset.state = 'play'; break
				case 'play':
				default:
					video.pause()
					btn.dataset.state = 'pause'; break
			}
		})

		getControl('changeVolume').addEventListener('input', e => {
			let newVolume = e.target.value/100

			video.volume = newVolume
			$storage.set(storageItemsNames.volume, newVolume)

			updateVolumeLevel()
		})

		getControl('changeMute').addEventListener('click', e => {
			if (getControl('changeVolume').value == 0) {
				video.volume = $storage.get(storageItemsNames.volume)
				getControl('changeVolume').value = $storage.get(storageItemsNames.volume) * 100
			} else {
				video.volume = 0
				getControl('changeVolume').value = 0
			}

			updateVolumeLevel()
		})

		getControl('fullscreen').addEventListener('click', toggleFullScreen)
		getControl('fullscreen').addEventListener('click', fsCtrlChangeState)

		video.load()

		let converse = () => {
			let queue = []

			let sourceBuffer = null

			let drain = () => {
				if (queue.length == 0) {
					return
				}

				if (sourceBuffer.updating) {
					return
				}

				let next = queue.shift()
				sourceBuffer.appendBuffer(next)
			}

			let reconnect = ({ data }) => {
				if (time != null) {
					clearTimeout(time)
				}

				if (data.type == 'error' || data.type == 'close') {
					if (body.dataset.state == 'work') {
						delete body.dataset.state
					}

					video.src = ''
				}
				console.log()
				time = setTimeout(converse, 1000)
			}

			socket = new WebSocket(`wss://${getInfoFromMeta('eientei:server')}/video/${getInfoFromMeta('eientei:user')}.wss`)

			socket.addEventListener('open', e => {
				let ms = new MediaSource()

				ms.onsourceopen = () => {
					sourceBuffer = ms.addSourceBuffer('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')

					sourceBuffer.onupdate = drain
					drain()
				}

				video.src = URL.createObjectURL(ms)

				if (!('state' in body.dataset) && body.dataset.state != 'work') {
					body.dataset.state = 'work'
				}
			})

			socket.addEventListener('error', e => reconnect({ data: e }))
			socket.addEventListener('close', e => reconnect({ data: e }))

			socket.addEventListener('message', e => {
				let fileReader = new FileReader()

				fileReader.onload = () => {
					let uint8ArrayNew = new Uint8Array(fileReader.result)

					//console.log('recv bytes', uint8ArrayNew.length)
					queue.push(uint8ArrayNew)

					if (sourceBuffer != null) {
						drain()
					}
				}

				fileReader.readAsArrayBuffer(e.data)
			})

			window.addEventListener('beforeunload', socket.close)
		}

		converse()
	}

	init()
})
