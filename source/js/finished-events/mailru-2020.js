/*
 * Первоапрельская покупка проекта mail.ru
 */

void (() => {
	const player = $make.qsf('.main .player', mainContainer)

	const styles = {
		mailb: {
			position: 'absolute',
			top: 0, left: 0,
			width: '100%', height: '100%',
			padding: '50px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#7955486e',
			fontSize: '40px'
		},
		content: {
			width: '100%', maxWidth: '700px',
			padding: '10px',
			position: 'relative'
		},
		closeBtn: {
			padding: '0 10px', cursor: 'pointer',
			visibility: 'hidden',
			position: 'absolute', marginLeft: '10px',
			backgroundColor: 'transparent', border: 0,
			color: '#fff'
		},
		image: {
			width: '100%', cursor: 'pointer'
		}
	}

	const images = ['atom', 'delivry', 'icq', 'lost', 'nyan', 'ok', 'pw', 'raid', 'warface']

	let flag = false

	const spawn = () => {
		flag = true

		for (let i = 0; i < Math.floor(10 + Math.random() * 11); i++) {
			let div = $create.elem('div')
			div.style.display = 'none'
			player.appendChild(div)
		}

		const mailb = $create.elem('div')

		Object.keys(styles.mailb).forEach(key => {
			mailb.style[key] = styles.mailb[key]
		})

		const content = $create.elem('div')

		Object.keys(styles.content).forEach(key => {
			content.style[key] = styles.content[key]
		})

		mailb.appendChild(content)

		const image = $create.elem('img')
		image.src = `/assets/img/prikols/${images[Math.floor(Math.random() * images.length)]}.jpg`

		image.onclick = () => open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

		Object.keys(styles.image).forEach(key => {
			image.style[key] = styles.image[key]
		})

		content.appendChild(image)

		const closeBtn = $create.elem('button', '<i class="fa fa-times" aria-hidden="true">')

		Object.keys(styles.closeBtn).forEach(key => {
			closeBtn.style[key] = styles.closeBtn[key]
		})

		closeBtn.onclick = () => {
			flag = false
			mailb.remove()
		}

		setTimeout(() => {
			closeBtn.style.visibility = 'initial'
		}, 3000)

		content.appendChild(closeBtn)

		player.appendChild(mailb)
	}

	if ($storage.get('nyan_mailru') === 'false' || !$storage.get('nyan_mailru')) {
		spawn()
	}

	setInterval(() => {
		if (!flag && ($storage.get('nyan_mailru') === 'false' || !$storage.get('nyan_mailru'))) {
			spawn()
		}
	}, 5 * 60 * 1000)
})()
