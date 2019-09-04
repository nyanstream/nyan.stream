'use strict'

moment.tz.setDefault('Europe/Moscow')

DOMAINS.radio = 'r-a-d.io'

let dataContainer = $make.qs('.data')

let $embed = {
	sched: () => doFetch({ fetchURL: API.schedule, handler: ({ data = [] }) => {
		let
			dayToday =      moment().format('DDD YY'),
			dayTodayFull =  moment().format('D MMMM (dddd)'),
			hourHow =       moment().format('HH'),
			unixNow =       moment().unix(),
			cutToHour = false

		dataContainer.textContent = ''
		dataContainer.appendChild($create.elem('p', dayTodayFull))

		/*
		 * @TODO сделать работу cut и в обратную сторону
		 */

		if ($check.get('cut')) {
			cutToHour = parseFloat($check.get('cut'))
		}

		data.forEach(item => {
			let
				timeS = moment.unix(item['s']),
				dayOfS = timeS.format('DDD YY'),
				hourOfS = timeS.format('HH'),
				timeE = moment.unix(item['e']),
				backupString = ''

			if (dayOfS == dayToday) {
				if (cutToHour && cutToHour > hourOfS) { return }

				if ('backup' in item && item.backup == true) {
					backupString = ` <span class="sched-backup">[${getString('backup')}]</span>`
				}

				dataContainer.appendChild(
					$create.elem(
						'p',
						`<span class="sched--time">${timeS.format('HH:mm')} &ndash; ${timeE.format('HH:mm')}:</span> <span class="sched--title">${item['title']}</span>${backupString}`
					)
				)
			}
		})
	}}),

	schedNext: () => doFetch({ fetchURL: API.schedule, handler: ({ data = [] }) => {
		let nextAirs = data.filter((e) => e['s'] > moment().unix())

		if (nextAirs.length == 0) { return }

		dataContainer.textContent = ''
		dataContainer.appendChild($create.elem('p', `Далее будет:<br>${moment.unix(nextAirs[0]['s']).format('HH:mm')} &ndash; ${nextAirs[0]['title']}` ))
	}}),

	song: () => doFetch({ fetchURL: `https://${DOMAINS.radio}/api`, handler: ({ data = {} }) => {
		let song = data.main.np

		dataContainer.textContent = ''
		dataContainer.appendChild($create.elem('p', song.replace(' - ', ' &ndash; ')))
	}}),

	time: () => dataContainer.textContent = `Время у стримера: ${moment().format('HH:mm:ss')}`
}

document.addEventListener('DOMContentLoaded', () => {
	let updTime = 5000

	if ($check.get('updtime')) {
		updTime = Number($check.get('updtime') + '000')
	}

	switch ($check.get('data')) {
		case 'sched':
			dataContainer.classList.add('sched')
			$embed.sched()
			setInterval(() => { $embed.sched() }, updTime)
			break
		case 'sched-next':
			dataContainer.classList.add('sched-next')
			$embed.schedNext()
			setInterval(() => { $embed.schedNext() }, updTime)
			break
		case 'song':
			dataContainer.classList.add('song')
			$embed.song()
			setInterval(() => { $embed.song() }, updTime)
			break
		case 'time':
			dataContainer.classList.add('time')
			setInterval(() => { $embed.time() }, 100)
			break
	}
})
