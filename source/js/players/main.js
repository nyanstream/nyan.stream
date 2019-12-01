'usr strict'

let playerInit = ({ server, type, link }) => {
	type = type.toLowerCase()

	const video = document.querySelector('.video');

	const source = `http://${server}/${link}`

	const dash = dashjs.MediaPlayer().create()

	//dash.getDebug().setLogToBrowserConsole(false)

	dash.initialize(video, source, true)

	new Plyr(video, {
		controls: ['play', 'mute', 'volume', 'pip', 'airplay', 'fullscreen'],
		autoplay: true,
		autopause: false,
		resetOnEnd: true,
		storage: {
			key: 'nyan_plyr'
		}
	})

	// if (!Hls.isSupported()) {
	// 	video.src = source
	// } else {
	// 	const hls = new Hls()

	// 	hls.loadSource(source)
	// 	hls.attachMedia(video)

	// 	window.hls = hls
	// }
}
