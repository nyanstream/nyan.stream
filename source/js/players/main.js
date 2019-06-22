'usr strict'

let playerInit = ({ server, type, link }) => {
	type = type.toLowerCase()

	// console.log(jwplayer())

	jwplayer('jw-player').setup({
		file: `https://${server}/${link}`,
		width: '100%', height: '100%',
		image: '/assets/img/offline.png',
		autostart: true
	})

	// let player = videojs('video-js', {
	// 	//width: '100%', height: '100%',
	// 	poster: '/assets/img/offline.png',
	// 	html5: {
	// 		hls: {
	// 			withCredentials: true
	// 		}
	// 	}
	// })

	// player.src({
	// 	src: `https://${server}/${link}`,
	// 	overrideNative: true,
	// 	autoplay: 'any',
	// 	controls: true
	// 	//liveui: true
	// })
}
