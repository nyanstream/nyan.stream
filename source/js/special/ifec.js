/*
 * iframe error checker
 * credits: https://stackoverflow.com/a/52458649
 */

document.addEventListener('DOMContentLoaded', () => {
	let frame = document.querySelector('iframe')

	frame.onload = () => {
		let _this = frame

		try {
			(_this.contentWindow || _this.contentDocument).location.href
		} catch (error) {
			console.warn('Player loading error: ' + error)
		}
	}
})
