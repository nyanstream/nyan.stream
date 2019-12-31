'use strict'

moment.tz.setDefault('Europe/Moscow')

DOMAINS.radio = 'r-a-d.io'

let dataContainer = $make.qs('.data')

let $embed = {
	sched: () => doFetch({ fetchURL: API.schedule, handler: ({ data = [] }) => {
		let
			dayToday =      moment().format('DDD YY'),
			dayTodayFull =  moment().format('D MMMM (dddd)')

		let
			unixNow =       moment().unix(),
			hourHow =       moment().format('HH')

		let cutToHour = false

		dataContainer.innerText = ''
		dataContainer.appendChild($create.elem('p', dayTodayFull))

		/*
		 * @TODO сделать работу cut и в обратную сторону
		 */

		if ($check.get('cut')) {
			cutToHour = Number($check.get('cut'))
		}

		data.forEach(item => {
			let
				timeS = moment.unix(item['s']),
				timeE = moment.unix(item['s'] + item['d']).

			let
				dayOfS = timeS.format('DDD YY'),
				hourOfS = timeS.format('HH')

			if (dayOfS == dayToday) {
				if (cutToHour && cutToHour > hourOfS) { return }

				dataContainer.appendChild(
					$create.elem(
						'p',
						`<span class="sched--time">${timeS.format('HH:mm')} &ndash; ${timeE.format('HH:mm')}:</span> <span class="sched--title">${item['title']}</span>`
					)
				)
			}
		})
	}}),

	schedNext: () => doFetch({ fetchURL: API.schedule, handler: ({ data = [] }) => {
		let nextAirs = data.filter((e) => e['s'] > moment().unix())

		if (nextAirs.length == 0) { return }

		dataContainer.innerHTML = `Далее будет:<br>${moment.unix(nextAirs[0]['s']).format('HH:mm')} &ndash; ${nextAirs[0]['title']}`
	}}),

	song: () => doFetch({ fetchURL: `https://${DOMAINS.radio}/api`, handler: ({ data = {} }) => {
		let song = data.main.np
		dataContainer.innerHTML = song.replace(' - ', ' &ndash; ')
	}}),

	time: () => dataContainer.innerText = moment().format('HH:mm:ss')
}

document.addEventListener('DOMContentLoaded', () => {
	let updTime = 5000

	if ($check.get('updtime')) {
		updTime = Number($check.get('updtime') + '000')
	}

	let URLData = $check.get('data')

	if (URLData) {
		dataContainer.classList.add(`data__${URLData}`)
	}

	switch (URLData) {
		case 'sched':
			$embed.sched()
			setInterval(() => { $embed.sched() }, updTime)
			break
		case 'sched-next':
			$embed.schedNext()
			setInterval(() => { $embed.schedNext() }, updTime)
			break
		case 'song':
			$embed.song()
			setInterval(() => { $embed.song() }, updTime)
			break
		case 'time':
			setInterval(() => { $embed.time() }, 100)
			break
	}
})
