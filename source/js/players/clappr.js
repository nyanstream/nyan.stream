'usr strict'

let playerInit = ({ server, type, link }) => {
	let plugins = []

	if (type.toLowerCase() == 'dash') {
		plugins.push(DashShakaPlayback)
	}

	let player = new Clappr.Player({
		source: `https://${server}/${link}`,
		width: '100%', height: '100%',
		plugins: plugins,
		parentId: '.player',
		poster: '/assets/img/offline.png',
		disableVideoTagContextMenu: true,
		autoPlay: true,
		shakaConfiguration: {
			preferredAudioLanguage: 'ru',
			streaming: {
				rebufferingGoal: 15
			}
		}
	})
}
