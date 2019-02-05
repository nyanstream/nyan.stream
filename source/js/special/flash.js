'use strict'

let hasFlash = () => {
	let
		hasFlash = false,
		flashMime = 'application/x-shockwave-flash'

	try {
		let fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
		if (fo) { hasFlash = true }
	} catch (e) {
		if (
			navigator.mimeTypes
			&& navigator.mimeTypes[flashMime] != undefined
			&& navigator.mimeTypes[flashMime].enabledPlugin
		) { hasFlash = true }
	}

	return hasFlash
}
