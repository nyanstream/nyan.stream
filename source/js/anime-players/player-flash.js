'use strict'

let playerInit = ({ player, file, vars, wmode }) => {
	let embed = $create.elem('embed')

	document.body.dataset.player = player

	let setEmbedAttributes = (attrsArrays = []) => {
		attrsArrays.forEach(attrArray => {
			embed.setAttribute(attrArray[0], attrArray[1])
		})
	}

	setEmbedAttributes([
		['src',              `${file}.swf`],
		['flashvars',         vars],
		['wmode',             wmode],

		['type',              'application/x-shockwave-flash'],
		['quality',           'best'],
		['scale',             'noscale'],
		['browserzoom',       'noscale'],
		['pluginspage',       'https://get.adobe.com/ru/flashplayer/'],

		['menu',              false],
		['allowfullscreen',   true]
	])

	if (hasFlash() || isEdge) {
		$make.qs('.player').appendChild(embed)
	} else {
		document.body.classList.add('no-flash')
	}
}
