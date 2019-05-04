'usr strict'

let playerInit = ({ server, type, link }) => {
	let plugins = []

	if (type.toLowerCase() == 'dash') {
		plugins.push(DashShakaPlayback)
	}

	let player = new Clappr.Player({
		source: `https://${server}/${link}`,
		plugins: plugins,
		parentId: '.player',
		shakaConfiguration: {
			preferredAudioLanguage: 'ru',
			streaming: {
				rebufferingGoal: 15
			}
		}
	})
}
