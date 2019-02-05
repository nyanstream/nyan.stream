'use strict'

let getInfoFromMeta = name => {
	let metaTag = document.head.querySelector(`meta[name='_nyan:${name}']`)

	return metaTag
		? metaTag.getAttribute('content')
		: void(0)
}
